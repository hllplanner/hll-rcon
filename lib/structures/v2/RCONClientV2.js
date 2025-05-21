const net = require("net");
const EventEmitter = require("events");
const xor = require("../../utils/XOR");
const ResponseMessage = require("./ResponseMessage");
const RequestMessage = require("./RequestMessage");
const AdminManager = require("./managers/AdminManager");
const SessionManager = require("./managers/SessionManager");
const MapManager = require("./managers/MapManager");
const PlayerManager = require("./managers/PlayerManager");
const LogManager = require("./managers/LogManager");

/**
 * Class representing an RCON v2 Client
 *
 * @class
 * @extends EventEmitter
 *
 * @property {boolean} initialContact - Indicates if the initial contact with the server has been made.
 * @property {net.Socket} socket - The socket connection to the server.
 * @property {string|null} cipher - The XOR cipher.
 * @property {string|null} authToken - The authentication token received after logging in.
 * @property {string} status - The current connection status of the client.
 * @property {number|null} messageIndex - The index of the current message being processed.
 * @property {Buffer|null} buffer - The buffer for storing incoming message data.
 * @property {number|null} bufferLength - The expected length of the current message buffer.
 * @property {Function|null} _pendingResolve - The resolve function for the current pending message.
 * @property {Function|null} _pendingReject - The reject function for the current pending message.
 * @property {AdminManager} admins - The controller for managing admins.
 * @property {SessionManager} session - The controller for the current game/map session.
 * @property {MapManager} maps - The controller for managing map rotation and sequences.
 * @property {PlayerManager} players - The controller for managing players.
 * @property {LogManager} logs - The controller responsible for fetching and managing server logs.
 * @property {Array<RequestMessage>} _messageQueue - Queue of messages awaiting transmission.
 * @property {boolean} _processingMessage - Whether or not the client is in the process of sending and receiving a message.
 * */
class RCONClientV2 extends EventEmitter {
  initialContact = false;
  socket = new net.Socket();
  cipher = null;
  authToken = null;

  status = "DISCONNECTED";

  messageIndex = null;
  buffer = null;
  bufferLength = null;

  _pendingResolve = null;
  _pendingReject = null;

  _messageQueue = [];
  _processingMessage = false;

  admins = new AdminManager(this);
  session = new SessionManager(this);
  maps = new MapManager(this);
  players = new PlayerManager(this);
  logs = new LogManager(this);

  /**
   * Constructs a new RCONClientV2 instance.
   * @param {Object} options - Configuration options for the client.
   * @param {string} options.host - The host address of the RCON server.
   * @param {number} options.port - The port of the RCON server.
   * @param {string} options.password - The password for authenticating with the server.
   */
  constructor({
    host,
    port,
    password
  }) {
    super();

    this.host = host;
    this.port = port;
    this.password = password;

    this.socket.on("data", this._handlePacket.bind(this));

    this.socket.connect(this.port, this.host, async () => {
      this.status = "CONNECTED";
      this.emit("connected");

      const ServerConnectMessage = new RequestMessage(this, "ServerConnect");

      await this._send(ServerConnectMessage, { encrypt: false });
    });
  }

  /**
   * Adds a message to the message queue and processes it.
   * @param {RequestMessage} message - The message to send.
   * @param {Object} [options] - Options for sending the message.
   * @param {boolean} [options.encrypt=true] - Whether to encrypt the message before sending.
   * @returns {Promise<Error|ResponseMessage>} - Resolves with the server's response or rejects with an error.
   * @private
   */
  _send(message, options) {
    return new Promise((resolve, reject) => {
      this._messageQueue.push({
        message, resolve, reject, encrypt: options?.encrypt !== undefined ? options.encrypt : true
      });
      if (!this._processingMessage)
        this._processQueue();
    });
  }

  /**
   * Processes the next message in the queue.
   * Sends the message to the server and sets up a timeout for the response.
   * If the queue is empty or a message is already being processed, it does nothing.
   * @private
   */
  async _processQueue() {
    if (this._messageQueue.length === 0 || this._processingMessage) return;

    const { resolve, reject, message, encrypt } = this._messageQueue.shift();

    this._pendingResolve = resolve;
    this._pendingReject = reject;
    this._processingMessage = true;

    let data;
    if (encrypt)
      data = xor(Buffer.from(message.wrap()), this.cipher);
    else
      data = Buffer.from(message.wrap());

    this.socket.write(data);

    this._timeout = setTimeout(() => {
      if (this._pendingReject) {
        this._pendingReject(new Error("Timeout waiting for response."));
        this._pendingResolve = null;
        this._pendingReject = null;

        this._processingMessage = false;
        this._processQueue();
      }
    }, 5000);
  }

  /**
   * Sends login message.
   * @private
   */
  async _login() {
    const LoginMessage = new RequestMessage(this, "Login", this.password);
    await this._send(LoginMessage);
  }

  /**
   * Handles incoming packets from the server.
   * @param {Buffer} data - The raw data received from the server.
   * @private
   */
  async _handlePacket(data) {
    // RCON v1 will send a 4 byte cipher as its initial contact. Discard this since v1 and v2 will use different sockets.
    if (!this.initialContact) {
      this.initialContact = true;
      return;
    }

    // Header structure for RCON v2: First 8 bytes of message, First 0-3 are the message index and 4-7 are the total packet length
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

    // Append data to buffer
    this.buffer = Buffer.concat([this.buffer, bodyBuffer]);

    // If the buffer has reached the indicated length, the full message has been received and should be handled.
    if (this.buffer.length === this.bufferLength) {
      // It's assumed that once the Login message is sent, all proceeding messages will be encrypted.
      if (this.cipher) {
        const unencrypted = xor(this.buffer, this.cipher);
        await this._handleMessage(JSON.parse(unencrypted.toString()));
      } else {
        await this._handleMessage(JSON.parse(this.buffer.toString()));
      }

      // Reset buffer for next message
      this.buffer = null;
    }
  }

  /**
   * Handles a complete message received from the server.
   * @param {Object} message - The parsed message object.
   * @private
   */
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
      this._pendingResolve(new ResponseMessage(this, this.messageIndex, message));
      this._pendingResolve = null;
      this._pendingReject = null;

      this._processingMessage = false;
      this._processQueue();
    }

    this.emit("message", message);

    switch (name) {
      // Received after sending ServerConnect, contains v2 cipher.
      case "ServerConnect": {
        this.cipher = Buffer.from(contentBody, "base64");
        this._login();

        break;
      }

      case "Login": {
        this.authToken = contentBody;
        this.status = "READY";
        this.emit("ready");

        break;
      }
    }
  }
}

module.exports = RCONClientV2;