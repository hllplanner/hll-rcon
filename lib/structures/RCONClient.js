const net = require("net");
const EventEmitter = require("events");
const RequestMessage = require("./RequestMessage");
const xor = require("../utils/XOR");

const AdminManager = require("./managers/AdminManager");
const SessionManager = require("./managers/SessionManager");
const MapManager = require("./managers/MapManager");
const PlayerManager = require("./managers/PlayerManager");
const LogManager = require("./managers/LogManager");
const ServerManager = require("./managers/ServerManager");

class RCONClient extends EventEmitter {
  socket = new net.Socket();
  cipher = null;
  authToken = null;

  status = "DISCONNECTED";

  messageIndex = 0;
  messageQueue = [];
  sentMessageCache = {};
  messageBuffer = Buffer.alloc(0);

  admins = new AdminManager(this);
  session = new SessionManager(this);
  maps = new MapManager(this);
  players = new PlayerManager(this);
  logs = new LogManager(this);
  server = new ServerManager(this);

  _pollingLogs = false;
  debug = false;

  /**
   * Constructs a new RCONClientV2 instance.
   *
   * @param {Object} options - Configuration options for the client.
   * @param {string} options.host - The host address of the RCON server.
   * @param {number} options.port - The port of the RCON server.
   * @param {string} options.password - The password for authenticating with the server.
   */
  constructor({
    host,
    port,
    password,
    debug,
    enableLogPolling,
    logPollingWindow,
    logPollingFrequency
  }) {
    super();

    this.host = host;
    this.port = port;
    this.password = password;
    this.debug = debug;

    this.socket.on("data", this._handlePacket.bind(this));

    this.socket.connect(this.port, this.host, async () => {
      this.status = "CONNECTED";
      if (this.debug) console.log("DEBUG[V2] - TCP Connection established.");

      setInterval(() => {
        this._processQueue();
        this._processBuffer();
      }, 1);

      const ServerConnectMessage = new RequestMessage(this, "ServerConnect");

      await this._send(ServerConnectMessage, { encrypt: false });
    });

    if (enableLogPolling) {
      this._initializeLogPolling({ logPollingWindow, logPollingFrequency });
    }
  }

  /**
   * Adds a message to the message queue.
   *
   * @param {RequestMessage} message - The message to send.
   * @param {Object} [options] - Options for sending the message.
   * @param {boolean} [options.encrypt=true] - Whether to encrypt the message before sending.
   * @returns {Promise<Error|ResponseMessage>} - Resolves with the server's response or rejects with an error.
   * @private
   */
  _send(message, options) {
    const id = this._generateMessageId();

    return new Promise((resolve, reject) => {
      if (this.debug) console.log(`DEBUG[V2] - Message added to queue: ${message.wrap()}`);
      const queueCacheObject = {
        id,
        message,
        resolve,
        reject,
        encrypt: options?.encrypt !== false
      };

      this.messageQueue.push(queueCacheObject);
    });
  }

 // Sends the next message in queue
  async _processQueue() {
    if (this.messageQueue.length === 0) return;

    const shiftedQueueItem = this.messageQueue.shift();
    const { id, message, encrypt } = shiftedQueueItem;

    const wrapped = message.wrap();
    const headerBuffer = Buffer.alloc(8);
    const wrappedContentBuffer = Buffer.from(wrapped);

    headerBuffer.writeUInt32LE(wrapped.length, 4);
    headerBuffer.writeUInt32LE(id, 0);

    const messageBuffer = Buffer.concat([headerBuffer, wrappedContentBuffer]);

    this.sentMessageCache[id] = shiftedQueueItem;
    let data;
    if (encrypt)
      data = Buffer.concat([headerBuffer, xor(wrappedContentBuffer, this.cipher)]);
    else
      data = messageBuffer;

    this.socket.write(data);
    if (this.debug) console.log(`DEBUG[V2] - Wrote message: ${message.wrap()}`);
  }

  // Processes the buffer to determine if there is a full message / many messages in the buffer.
  async _processBuffer() {
    if(this.messageBuffer.length === 0) return;

    const header = this.messageBuffer.subarray(0, 8);
    const messageId = header.readUInt32LE(0);
    const messageLength = header.readUInt32LE(4);

    if(this.messageBuffer.length < 8 + messageLength) return;

    let messageContentsBuffer = this.messageBuffer.subarray(8, messageLength + 8);
    if (this.cipher) {
      messageContentsBuffer = xor(messageContentsBuffer, this.cipher);
    }

    this.messageBuffer = this.messageBuffer.subarray(messageLength + 8);
    this._handleMessage(JSON.parse(messageContentsBuffer.toString()), messageId);
  }

  _handlePacket(data) {
    this.messageBuffer = Buffer.concat([this.messageBuffer, data]);
  }

  _handleMessage(message, messageId) {
    let { name, contentBody, statusCode, statusMessage } = message;

    try {
      const parsed = JSON.parse(contentBody);
      message.contentBody = parsed;
      contentBody = parsed;
    } catch {
    }

    if (this.debug) console.log(`DEBUG[V2] - Received message: ${JSON.stringify(message)}`);

    this.sentMessageCache[messageId].resolve(message);
    delete this.sentMessageCache[messageId];

    this.emit("message", message);

    switch (name) {
      // Received after sending ServerConnect, contains v2 cipher.
      case "ServerConnect": {
        this.cipher = Buffer.from(contentBody, "base64");
        this._login();

        break;
      }

      case "Login": {
        if(statusCode !== 200) {
          throw new Error(`DEBUG[V2] - Error logging in: ${statusMessage}`)
        }

        this.authToken = contentBody;
        this.status = "READY";
        this.emit("ready");

        break;
      }
    }
  }

  // Sends login message
  async _login() {
    const LoginMessage = new RequestMessage(this, "Login", this.password);
    await this._send(LoginMessage);
  }

  // Initializes log polling
  _initializeLogPolling({ logPollingWindow, logPollingFrequency }) {
    if (this._pollingLogs) return;
    this._pollingLogs = true;

    setInterval(async () => {
      if (this.status === "READY")
        await this.logs.fetch(logPollingWindow);
    }, logPollingFrequency);
  }

  // Increments and returns next request/message ID
  _generateMessageId() {
    this.messageIndex += 1;
    return this.messageIndex;
  }
}

module.exports = RCONClient;