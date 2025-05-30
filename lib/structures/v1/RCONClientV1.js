const net = require("net");
const EventEmitter = require("events");
const xor = require("../../utils/XOR");
const AdminManager = require("./managers/AdminManager");
const SessionManager = require("./managers/SessionManager");
const MapManager = require("./managers/MapManager");
const PlayerManager = require("./managers/PlayerManager");
const LogManager = require("./managers/LogManager");
const ServerManager = require("./managers/ServerManager");

/**
 * Class representing an RCON v1 Client
 *
 * @class
 * @extends EventEmitter
 *
 * @property {net.Socket} socket - The socket connection to the RCON server.
 * @property {Buffer|null} cipher - The cipher used for encrypting and decrypting messages.
 * @property {string} status - The current connection status of the client. Possible values: "DISCONNECTED", "CONNECTED", "READY".
 * @property {number} inactivityTimeout - Timeout duration (in milliseconds) to determine when a full message has been received.
 * @property {number|null} _temporaryInactivityTimeout - Temporary override for the inactivity timeout.
 * @property {boolean} _expediteShortResponses - Whether or not to expedite short responses (`SUCCESS` and `FAIL`).
 * @property {Buffer} _buffer - Buffer to store incoming data from the server.
 * @property {Function|null} _pendingResolve - The resolve function for the current message promise.
 * @property {Function|null} _pendingReject - The reject function for the current message promise.
 * @property {NodeJS.Timeout|null} _timeoutHandle - The handle for the inactivity timeout.
 * @property {string} host - The host address of the RCON server.
 * @property {number} port - The port number of the RCON server.
 * @property {string} password - The RCON password for authenticating with the server.
 * @property {AdminManager} admins - The controller for managing admins.
 * @property {SessionManager} session - The controller for managing the session.
 * @property {MapManager} maps - The controller for managing map rotation and sequences.
 * @property {PlayerManager} players - The controller for managing players.
 * @property {LogManager} logs - The controller responsible for fetching and managing server logs.
 * @property {ServerManager} server - The controller responsible for managing the server configuration.
 * @property {Array<string>} _messageQueue - Queue of messages awaiting transmission.
 * @property {boolean} _processingMessage - Whether or not the client is in the process of sending and receiving a message.
 * @property {boolean} _pollingLogs - Whether or not log polling is enabled for this client.
 * @property {boolean} debug - Whether or not to log debug messages.
 * */
class RCONClientV1 extends EventEmitter {
  socket = new net.Socket();
  cipher = null;
  status = "DISCONNECTED";

  inactivityTimeout = 1_000;
  _temporaryInactivityTimeout = null;
  _expediteShortResponses = false;

  _buffer = Buffer.alloc(0);
  _pendingResolve = null;
  _pendingReject = null;
  _timeoutHandle = null;

  _messageQueue = [];
  _processingMessage = false;

  admins = new AdminManager(this);
  session = new SessionManager(this);
  maps = new MapManager(this);
  players = new PlayerManager(this);
  logs = new LogManager(this);
  server = new ServerManager(this);

  _pollingLogs = false;
  debug = false;

  /**
   * Constructs a new RCONClientV1 instance.
   * @param {Object} options - Configuration options for the client.
   * @param {string} options.host - The host address of the RCON server.
   * @param {number} options.port - The port number of the RCON server.
   * @param {string} options.password - The RCON password for authenticating with the RCON server.
   * @param {boolean} [options.debug=false] - Whether or not to display debug logs.
   * @param {number} [options.inactivityTimeout=1000] - Timeout duration from last packet to determine when a full message has been received.
   * @param {boolean} [options.expediteShortResponses=false] - Whether or not to expedite short server responses.
   */
  constructor({
    host,
    port,
    password,
    debug,
    inactivityTimeout = 1_000,
    expediteShortResponses = false
  }) {
    super();

    // Initialize Variables
    this.host = host;
    this.port = port;
    this.password = password;
    this.inactivityTimeout = inactivityTimeout;
    this.debug = debug;
    this._expediteShortResponses = expediteShortResponses;

    // Initialize Listeners
    this.socket.on("data", this._handlePacket.bind(this));

    this.socket.connect(this.port, this.host, async () => {
      if (this.debug) console.log("DEBUG[V1] - TCP Connection established.");
      this.status = "CONNECTED";
    });
  }

  /**
   * Adds a message to the message queue and processes it.
   * @param {RequestMessage|string} message - The message to send. Can be a `RequestMessage` object or a raw string.
   * @param {Object} [options] - Options for sending the message.
   * @param {boolean} [options.encrypt=true] - Whether to encrypt the message before sending.
   * @param {number} [options.inactivityTimeout] - Optional timeout duration (in milliseconds) for inactivity.
   * @param {number} [options.shortResponse] - If the response from the server is either `SUCCESS` or `FAIL`.
   * @returns {Promise<Error|string>} - Resolves with the server's response or rejects with an error.
   * @private
   */
  _send(message, options = {}) {
    return new Promise((resolve, reject) => {
      if (this.debug) console.log(`DEBUG[V1] - Message added to queue: ${message}`);
      this._messageQueue.push({ message, options, resolve, reject });
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
  _processQueue() {
    if (this._messageQueue.length === 0 || this._processingMessage) return;
    this._processingMessage = true;

    const { message, options, resolve, reject } = this._messageQueue.shift();

    if (options.inactivityTimeout)
      this._temporaryInactivityTimeout = options.inactivityTimeout;

    if (options.shortResponse && this._expediteShortResponses)
      this._temporaryInactivityTimeout = 1;

    this._pendingResolve = resolve;
    this._pendingReject = reject;
    this._buffer = Buffer.alloc(0); // Clear previous buffer

    if (this.debug) console.log(`DEBUG[V1] - Attempting to write message: ${message}`);
    this.socket.write(xor(Buffer.from(message), this.cipher));
    if (this.debug) console.log(`DEBUG[V1] - Wrote message: ${message}`);
  }

  /**
   * Handles incoming packets from the RCON server.
   * @param {Buffer} data - The incoming data buffer.
   * @private
   */
  async _handlePacket(data) {
    if (!this.cipher) {
      // First packet is cipher.
      this.cipher = data;
      // Login
      if (this.debug) console.log("DEBUG[V1] - Received cipher, attempting to log in.");
      this.socket.write(xor(Buffer.from(`login ${this.password}`), this.cipher));
      return;
    }

    // Login Process
    // If the client isn't ready, check to see if second message (login response) was success.
    if (this.status !== "READY") {
      const dataString = xor(data, this.cipher).toString();

      if (dataString === "SUCCESS") {
        this.status = "READY";
        this.emit("ready");
        if (this.debug) console.log("DEBUG[V1] - Logged in successfully.");
        return;
      } else {
        throw new Error(`Error logging in: ${dataString}`);
      }
    }

    // Append to buffer
    this._buffer = Buffer.concat([this._buffer, data]);

    // Reset timeout on each data chunk received
    this._resetTimeout();
  }

  /**
   * Resets the inactivity timeout. If the timeout expires, resolves the current message.
   * @private
   */
  _resetTimeout() {
    // Clear timeout from previous message
    if (this._timeoutHandle) {
      clearTimeout(this._timeoutHandle);
    }

    this._timeoutHandle = setTimeout(() => {
      if (this._pendingResolve) {
        // Message is considered to be fully received from this point.
        if (this.debug) console.log(`DEBUG[V1] - Received message: ${xor(this._buffer, this.cipher).toString()}`);

        this._pendingResolve(xor(this._buffer, this.cipher).toString());
        this._pendingResolve = null;
        this._pendingReject = null;
        this._buffer = Buffer.alloc(0);

        // Clear temporary inactivity timeout
        this._temporaryInactivityTimeout = null;

        this._processingMessage = false;
        this._processQueue();
      }
    }, this._temporaryInactivityTimeout || this.inactivityTimeout);
  }

  /**
   * Initializes log polling.
   * @private
   */
  _initializeLogPolling({ pollWindow, pollFrequency }) {
    if (this._pollingLogs) return;
    this._pollingLogs = true;

    setInterval(async () => {
      if (this.status === "READY")
        await this.logs.fetch(pollWindow);
    }, pollFrequency);
  }
}

module.exports = RCONClientV1;