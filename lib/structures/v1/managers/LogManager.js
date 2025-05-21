const parseLogEntry = require("../../../utils/parseLogEntry");
const crypto = require("crypto");

/**
 * The controller responsible for managing logs through RCONv1.
 *
 * @class
 * @property {RCONClientV1} client - The RCON v1 client instance.
 * @property {Map<string, Object>} cache - A deduplicated key-value store of cached logs.
 */
class LogManager {
  client;
  cache = new Map();

  /**
   * Creates an instance of LogManager.
   *
   * @param {RCONClientV1} client - The RCON v1 client instance.
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Fetches logs from the server.
   *
   * @param {number} backTrack - The time in seconds to backtrack for logs.
   * @param {string} [filter=""] - A filter string to narrow down log entries.
   * @returns {Promise<Array<Object>>} A promise that resolves with an array of parsed log entries.
   */
  async fetch(backTrack, filter = "") {
    const response = await this.client._send(`ShowLog ${backTrack} ${filter}`);

    const escapeRegex = /\n(?!\[.+? \(\d+\)\])/g;
    const escaped = response.replace(escapeRegex, "\\n");

    const parsed = escaped.split("\n").map(log => this._parseEntry(log));

    return parsed;
  }

  /**
   * Parses a log entry and caches it.
   *
   * @private
   * @param {string} entry - The raw log entry to parse.
   * @returns {Object} The parsed log entry.
   */
  _parseEntry(entry) {
    const parsed = parseLogEntry({
      message: entry
    });
    const id = this._hashLog(parsed);

    if (!this.cache.get(id)) {
      this.cache.set(id, parsed);
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
