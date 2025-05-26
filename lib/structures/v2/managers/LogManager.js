const RequestMessage = require("../RequestMessage");
const parseLogEntry = require("../../../utils/parseLogEntry");
const crypto = require("crypto");

/**
 * Class for managing logs through RCONv2.
 *
 * @class
 *
 * @property {RCONClientV2} client - The RCONv2 Client
 * @property {Map<string, Object>} cache - A deduplicated key-value store of cached logs.
 * */
class LogManager {
  client;
  cache = new Map();
  pollInterval = 1000;
  pollWindow = 60; // 60 Seconds

  /**
   * Creates an instance of the LogManager
   *
   * @param {RCONClientV2} client - The RCONv2 client instance.
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Fetches logs from the server.
   *
   * @param {number} backTrack - The time in seconds to backtrack for logs.
   * @param {string} [filter] - A filter string to narrow down log entries.
   * @returns {Promise<Array<Object>>} A promise that resolves with an array of parsed log entries.
   * @throws {Error} If the server responds with an error.
   */
  async fetch(backTrack, filter) {
    const requestMessage = new RequestMessage(this.client, "AdminLog", {
      ...(backTrack && { LogBackTrackTime: backTrack }),
      ...(filter && { Filters: filter })
    });

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200) {
      const parsed = response.contentBody.entries.map(entry => this._parseEntry(entry));

      return parsed;
    } else
      throw new Error(`Error fetching logs: ${response.stringify()}`);
  }

  /**
   * Parses a log entry and caches it.
   *
   * @private
   * @param {Object} entry - The raw log entry to parse.
   * @returns {Object} The parsed log entry.
   */
  _parseEntry(entry) {
    const parsed = parseLogEntry(entry);
    const id = this._hashLog(parsed);

    if (!this.cache.get(id)) {
      this.cache.set(id, parsed);
      this.client.emit("newLog", {
        id,
        parsed
      });
    }

    return parsed;
  }

  /**
   * Generates a unique hash for a parsed log entry.
   *
   * @private
   * @param {Object} parsedLog - The parsed log entry.
   * @returns {string} The hash of the log entry.
   */
  _hashLog(parsedLog) {
    return crypto.createHash("sha256").update(JSON.stringify(parsedLog)).digest("hex");
  }
}

module.exports = LogManager;
