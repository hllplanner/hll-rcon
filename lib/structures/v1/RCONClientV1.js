const net = require('net');
const EventEmitter = require('events');
const xor = require('../../utils/XOR');

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
 * @property {Buffer} _buffer - Buffer to store incoming data from the server.
 * @property {Function|null} _pendingResolve - The resolve function for the current message promise.
 * @property {Function|null} _pendingReject - The reject function for the current message promise.
 * @property {NodeJS.Timeout|null} _timeoutHandle - The handle for the inactivity timeout.
 * @property {string} host - The host address of the RCON server.
 * @property {number} port - The port number of the RCON server.
 * @property {string} password - The RCON password for authenticating with the server.
 * */
class RCONClientV1 extends EventEmitter {
  socket = new net.Socket();
  cipher = null;
  status = "DISCONNECTED";

  inactivityTimeout = 1_000;
  _temporaryInactivityTimeout = null;

  _buffer = Buffer.alloc(0);
  _pendingResolve = null;
  _pendingReject = null;
  _timeoutHandle = null;

  /**
   * Constructs a new RCONClientV1 instance.
   * @param {Object} options - Configuration options for the client.
   * @param {string} options.host - The host address of the RCON server.
   * @param {number} options.port - The port number of the RCON server.
   * @param {string} options.password - The RCON password for authenticating with the RCON server.
   * @param {number} [options.inactivityTimeout=1000] - Timeout duration from last packet to determine when a full message has been received.
   */
  constructor({
    host,
    port,
    password,
    inactivityTimeout
  }) {
    super();

    // Initialize Variables
    this.host = host;
    this.port = port;
    this.password = password;
    this.inactivityTimeout = inactivityTimeout || 1_000;

    // Initialize Listeners
    this.socket.on('data', this._handlePacket.bind(this));

    this.socket.connect(this.port, this.host, async () => {
      this.status = "CONNECTED";
    });
  }

  /**
   * Sends a message to the RCON server.
   * @param {string} message - The unencrypted message to send.
   * @returns {Promise<string>} A promise that resolves with the server's response.
   */
  _send(message, options = {}) {
    return new Promise((resolve, reject) => {
      if (this._pendingResolve) {
        return reject(new Error("A message is already in flight."));
      }

      if (options.inactivityTimeout)
        this._temporaryInactivityTimeout = options.inactivityTimeout;

      this._pendingResolve = resolve;
      this._pendingReject = reject;
      this._buffer = Buffer.alloc(0); // Clear previous buffer

      this.socket.write(xor(Buffer.from(message), this.cipher));

      // Start the 1-second timeout fallback
      this._resetTimeout();
    });
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
      this.socket.write(xor(Buffer.from(`login ${this.password}`), this.cipher));
      return;
    }

    // Login Process
    // If the client isn't ready, check to see if second message (login response) was success.
    if (this.status !== "READY") {
      const dataString = xor(data, this.cipher).toString();

      if (dataString === "SUCCESS") {
        this.status = "READY";
        this.emit('ready');
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
        this._pendingResolve(xor(this._buffer, this.cipher).toString());
        this._pendingResolve = null;
        this._pendingReject = null;
        this._buffer = Buffer.alloc(0);

        // Clear temporary inactivity timeout
        this._temporaryInactivityTimeout = null;
      }
    }, this._temporaryInactivityTimeout || this.inactivityTimeout);
  }
}

module.exports = RCONClientV1;