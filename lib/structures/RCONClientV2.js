const net = require('net');
const EventEmitter = require('events');
const Message = require('./MessageV2');
const xor = require('../utils/XOR');

class RCONClientV2 extends EventEmitter {
  initialContact = false;
  socket = new net.Socket();
  cipher = null;
  authToken = null;

  messageIndex = null;
  buffer = null;
  bufferLength = null;

  _pendingResolve = null;
  _pendingReject = null;

  status = "DISCONNECTED";

  constructor({
    host,
    port,
    password
  }) {
    super();

    this.host = host;
    this.port = port;
    this.password = password;

    this.socket.on('data', this._handlePacket.bind(this));

    this.socket.connect(this.port, this.host, async () => {
      this.status = "CONNECTED";
      this.emit('connected');

      const ServerConnectMessage = new Message(this, "ServerConnect");

      await this._sendUnencrypted(ServerConnectMessage);
    })
  }

  async _login() {
    const LoginMessage = new Message(this, "Login", this.password);
    await this._send(LoginMessage);
  }

  // Handle each received packet
  async _handlePacket(data) {
    // RCON v1 will send a 4 byte cipher as its initial contact. Discard this since v1 and v2 will use different sockets.
    if (!this.initialContact) {
      this.initialContact = true;
      return;
    }

    const messageIndex = data.readUInt32LE(0);
    const messageLength = data.readUInt32LE(4);
    // From what I can tell, the header is only included in the first packet in a sequence of packets.
    // If we haven't already initiated a buffer, its the first message in the sequence, so we cut the first 8 bytes, otherwise the full buffer of the packet is message body contents.
    const bodyBuffer = this.buffer ? data : data.subarray(8);

    if (!this.buffer) {
      this.buffer = Buffer.alloc(0);
      this.bufferLength = messageLength;
      this.messageIndex = messageIndex;
    }

    this.buffer = Buffer.concat([this.buffer, bodyBuffer]);

    // If the buffer has reached the indicated length, the full message has been received and should be handled.
    if (this.buffer.length === this.bufferLength) {
      // It's assumed that once the Login message is sent, all proceeding messages will be encrypted.
      if (this.cipher) {
        const unencrypted = xor(this.buffer, this.cipher);
        await this._handleMessage(JSON.parse(unencrypted.toString()));
      } else {
        await this._handleMessage(JSON.parse(this.buffer.toString()))
      }

      // Reset buffer for next message
      this.buffer = null;
    }
  }

  // Handle complete messages
  async _handleMessage(message) {
    let { statusCode, statusMessage, name, contentBody } = message;

    try {
      message.contentBody = contentBody = JSON.parse(contentBody);
    } catch {
    }

    if (this._timeout) {
      clearTimeout(this._timeout);
      this._timeout = null;
    }

    if (statusCode === 401) throw new Error(`Unauthorized: ${statusMessage}`);
    if (statusCode === 400) throw new Error(`Bad Request: ${JSON.stringify(message)}`);
    if (statusCode === 500) throw new Error(`Internal Server Error: ${statusMessage}`);

    if (this._pendingResolve) {
      this._pendingResolve(message);
      this._pendingResolve = null;
      this._pendingReject = null;
    }

    this.emit('message', message)

    switch (name) {
      // Received after sending ServerConnect, contains v2 cipher.
      case "ServerConnect": {
        this.cipher = Buffer.from(contentBody, 'base64');
        this._login();

        break;
      }

      case "Login": {
        this.authToken = contentBody;
        this.status = "READY";
        this.emit('ready');

        break;
      }
    }
  }

  // Send unencrypted message to socket.
  // Message should be JSON.
  // Should only be used for ServerConnect
  _sendUnencrypted(message) {
    return new Promise((resolve, reject) => {
      if (this._pendingResolve) {
        return reject(new Error("A message is already in flight."));
      }

      this._pendingResolve = resolve;
      this._pendingReject = reject;

      this.socket.write(message.wrap());

      this._timeout = setTimeout(() => {
        if (this._pendingReject) {
          this._pendingReject(new Error("Timeout waiting for response."));
          this._pendingResolve = null;
          this._pendingReject = null;
        }
      }, 5000);
    })
  }

  // For sending encrypted messages to socket.
  // Message should be JSON.
  _send(message) {
    return new Promise((resolve, reject) => {
      if (this._pendingResolve) {
        return reject(new Error("A message is already in flight."));
      }

      this._pendingResolve = resolve;
      this._pendingReject = reject;

      const encrypted = xor(Buffer.from(message.wrap()), this.cipher);
      this.socket.write(encrypted);

      this._timeout = setTimeout(() => {
        if (this._pendingReject) {
          this._pendingReject(new Error("Timeout waiting for response."));
          this._pendingResolve = null;
          this._pendingReject = null;
        }
      }, 5000);
    })
  }
}

module.exports = RCONClientV2;