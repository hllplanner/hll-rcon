const EventEmitter = require('events');
const RCONClientV1 = require('./v1/RCONClientV1');
const RCONClientV2 = require('./v2/RCONClientV2');

/**
 * IRCONClient is a wrapper class for managing both RCON v1 and v2.
 *
 * @class
 * @extends EventEmitter
 *
 * @property {string} host The host address of the RCON server.
 * @property {(number|string)} port The port of the RCON server.
 * @property {string} password The password for the RCON server.
 * @property {number} v1InactivityTimeout Timeout for V1 client inactivity in milliseconds.
 * @property {boolean} enableV1 Whether the V1 client is enabled.
 * @property {RCONClientV1|null} v1Client The instance of the V1 client.
 * @property {boolean} enableV2 Whether the V2 client is enabled.
 * @property {RCONClientV2|null} v2Client The instance of the V2 client.
 */
class IRCONClient extends EventEmitter {
  host;
  port;
  password;
  v1InactivityTimeout;

  enableV1;
  v1Client;

  enableV2;
  v2Client;

  /**
   * Creates an instance of IRCONClient.
   *
   * @extends EventEmitter
   *
   * @param {Object} options Configuration options for the client.
   * @param {string} options.host The host address of the RCON server.
   * @param {(number | string)} options.port The port of the RCON server.
   * @param {string} options.password The password for the RCON server.
   * @param {boolean} [options.enableV1=true] Whether to enable the V1 client.
   * @param {number} [options.v1InactivityTimeout=1000] Timeout for V1 client inactivity in milliseconds.
   * @param {boolean} [options.enableV2=true] Whether to enable the V2 client.
   *
   * @throws {Error} If any of `host`, `port`, or `password` is missing.
   */
  constructor({
    host,
    port,
    password,
    enableV1 = true,
    v1InactivityTimeout = 1_000,
    enableV2 = true
  } = {}) {
    super();

    if (!host || !port || !password) throw new Error('Missing one of: Host, port, password.');

    this.host = host;
    this.port = port;
    this.password = password;
    this.v1InactivityTimeout = v1InactivityTimeout;

    this.enableV1 = enableV1;
    this.enableV2 = enableV2;

    if (enableV1) {
      const client = new RCONClientV1({ host, port, password, inactivityTimeout: v1InactivityTimeout });

      client.on("ready", () => {
        if (!this.enableV2 || this.v2Client.status === "READY") this.emit("ready");
      })

      this.v1Client = client;
    }

    if (enableV2) {
      const client = new RCONClientV2({ host, port, password });

      client.on("ready", () => {
        if (!this.enableV1 || this.v1Client.status === "READY") this.emit("ready");
      })

      this.v2Client = client;
    }
  }

  /**
   * Sends a message using the V1 client.
   *
   * @param {string} message The message to send.
   * @param {Object} [options] Additional options for the V1 client.
   * @returns {Promise<any>} A promise that resolves with the response from the server.
   */
  sendV1(message, options) {
    return this.v1Client._send(message, options);
  }

  /**
   * Sends a message using the V2 client.
   *
   * @param {RequestMessage} message The message to send.
   * @returns {Promise<ResponseMessage>} A promise that resolves with the response from the server.
   */
  sendV2(message) {
    return this.v2Client._send(message);
  }
}

module.exports = IRCONClient;