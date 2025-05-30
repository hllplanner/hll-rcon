const EventEmitter = require("events");
const RCONClientV1 = require("./v1/RCONClientV1");
const RCONClientV2 = require("./v2/RCONClientV2");

/**
 * IRCONClient is a wrapper class for managing both RCON v1 and v2.
 *
 * @class
 * @extends EventEmitter
 *
 * @property {string} host - The host address of the RCON server.
 * @property {(number|string)} port - The port of the RCON server.
 * @property {string} password - The password for the RCON server.
 * @property {number} v1InactivityTimeout - Timeout for V1 client inactivity in milliseconds.
 * @property {RCONClientV1|null} v1Client - The instance of the V1 client.
 * @property {RCONClientV2|null} v2Client - The instance of the V2 client.
 * @property {boolean} enableLogPolling - Whether or not log polling is enabled.
 * @property {number} pollSource - From which RCON version to poll logs from.
 * @property {number} pollWindow - How long to backtrack log polling in each request, in seconds.
 * @property {number} pollFrequency - How frequently to poll logs, in milliseconds.
 * @property {boolean} debug - Whether or not debugging is enabled.
 */
class IRCONClient extends EventEmitter {
  host;
  port;
  password;
  v1InactivityTimeout;

  v1Client;
  v2Client;

  enableLogPolling;
  pollSource;
  pollWindow;
  pollFrequency;

  /**
   * Creates an instance of IRCONClient.
   *
   * @extends EventEmitter
   *
   * @param {Object} options - Configuration options for the client.
   * @param {string} options.host - The host address of the RCON server.
   * @param {(number | string)} options.port - The port of the RCON server.
   * @param {string} options.password - The password for the RCON server.
   * @param {number} [options.v1InactivityTimeout=1000] - Timeout for V1 client inactivity in milliseconds.
   * @param {boolean} [options.v1ExpediteShortResponses=false] - Whether or not to expedite short server responses.
   * @param {boolean} [enableLogPolling=true] - Enable log polling.
   * @param {number} [pollSource=2] - From which RCON client to poll logs from.
   * @param {number} [pollWindow] - How long to backtrack logs while polling, in seconds.
   * @param {number} [pollFrequency] - How frequently to poll logs, in milliseconds.
   * @param {boolean | number} [debug] - Enable debugging. Use `true` to enable for both RCONv1 and RCONv2, otherwise provide the number for which RCON version to enable logging for.
   *
   * @throws {Error} If any of `host`, `port`, or `password` is missing.
   */
  constructor({
    host,
    port,
    password,

    v1InactivityTimeout = 1_000,
    v1ExpediteShortResponses = false,

    enableLogPolling = true,
    pollSource = 2,
    pollWindow = 30,
    pollFrequency = 1000,

    debug = false
  } = {}) {
    super();

    if (!host || !port || !password) throw new Error("Missing one of: Host, port, password.");
    if (typeof debug !== "boolean" && ![1, 2].includes(debug)) throw new Error("Invalid debug option.");

    this.host = host;
    this.port = port;
    this.password = password;
    this.v1InactivityTimeout = v1InactivityTimeout;
    this.v1ExpediteShortResponses = v1ExpediteShortResponses;

    this.enableLogPolling = enableLogPolling;
    this.pollSource = pollSource;
    this.pollWindow = pollWindow;
    this.pollFrequency = pollFrequency;

    this.debug = debug;

    this.v1Client = new RCONClientV1({
      host,
      port,
      password,
      inactivityTimeout: v1InactivityTimeout,
      expediteShortResponses: v1ExpediteShortResponses,
      debug: debug === true || debug === 1
    });

    this.v2Client = new RCONClientV2({ host, port, password, debug: debug === true || debug === 2 });

    this.v1Client.once("ready", () => {
      if (this.v2Client.status === "READY") {
        if (this.pollSource === 1 && this.enableLogPolling) {
          this.v1Client._initializeLogPolling({ pollWindow, pollFrequency });

          this.v1Client.on("newLog", (log) => {
            this.emit("newLog", log);

            this.emit(log.parsed.type, log);
          });
        }

        this.emit("ready");
      }
    });

    this.v2Client.once("ready", () => {
      if (this.v1Client.status === "READY") {
        if (this.pollSource === 2 && this.enableLogPolling) {
          this.v2Client._initializeLogPolling({ pollWindow, pollFrequency });

          this.v2Client.on("newLog", (log) => {
            this.emit("newLog", log);

            this.emit(log.parsed.type, log);
          });
        }

        this.emit("ready");
      }
    });
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