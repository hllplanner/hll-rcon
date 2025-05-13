const net = require('net');
const EventEmitter = require('events');

// Encrypt/Decrypt xor given a key. Expects input to be buffer.
function xor(inputBuffer, key) {
  const keyBuffer = Buffer.from(key, 'utf8');
  const outputBuffer = Buffer.alloc(inputBuffer.length);

  for (let i = 0; i < inputBuffer.length; i++) {
    outputBuffer[i] = inputBuffer[i] ^ keyBuffer[i % keyBuffer.length];
  }

  return outputBuffer;
}

module.exports = class RCONClient extends EventEmitter {
  socket = new net.Socket();

  v1Cipher = null;
  v2Cipher = null;
  authToken = null;

  messageIndex = null;
  buffer = null;
  bufferLength = null;

  _pendingResolve = null;
  _pendingReject = null;

  constructor({ host, port, password }) {
    super();

    this.host = host;
    this.port = port;
    this.password = password;

    this.socket.on('data', this._handlePacket.bind(this));

    this.socket.connect(this.port, this.host, async () => {
      this.emit('connected');

      const ServerConnectMessage = {
        AuthToken: "",
        Version: "2",
        Name: "ServerConnect",
        ContentBody: ""
      }

      await this._sendUnencrypted(ServerConnectMessage);
    })
  }

  // Handle each received packet
  async _handlePacket(data) {
    // RCON v1 will send a 4 byte cipher as its initial contact.
    // TODO: Incorporate rcon v1 in the future
    if (!this.v1Cipher) {
      this.v1Cipher = data;
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
      if (this.v2Cipher) {
        const unencrypted = xor(this.buffer, this.v2Cipher);
        this._handleMessage(JSON.parse(unencrypted.toString()));
      } else {
        this._handleMessage(JSON.parse(this.buffer.toString()))
      }

      // Reset buffer for next message
      this.buffer = null;
    }
  }

  // Handle complete messages
  async _handleMessage(message) {
    const { statusCode, statusMessage, name, contentBody } = message;

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
        this.v2Cipher = Buffer.from(contentBody, 'base64');

        const LoginMessage = {
          AuthToken: "",
          Version: "2",
          Name: "Login",
          ContentBody: this.password
        }

        await this._send(LoginMessage);

        break;
      }

      case "Login": {
        this.authToken = contentBody;
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

      this.socket.write(JSON.stringify(message));

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

      const encrypted = xor(Buffer.from(JSON.stringify(message)), this.v2Cipher);
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