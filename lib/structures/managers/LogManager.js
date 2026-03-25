const RequestMessage = require("../RequestMessage");
const parseLogEntry = require("../../utils/parseLogEntry");
const crypto = require("crypto");

/**
 * Class for managing logs through RCONv2.
 *
 * @class
 *
 * @property {RCONClient} client - The RCONv2 Client.
 * @property {Map<string, Object>} cache - A deduplicated key-value store of cached logs.
 * */
class LogManager {
  client;
  cache = new Map();

  /**
   * Creates an instance of the LogManager.
   *
   * @param {RCONClient} client - The RCONv2 client instance.
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Fetches logs from the server.
   *
   * @param {number} backTrack - The time in seconds to backtrack for logs.
   * @param {string} [filter] - A filter string to narrow down log entries.
   * @returns {Promise<{ success: boolean, error: string?, logs?: Array<Log> }>}
   * @throws {Error} If `backTrack` is missing.
   */
  async fetch(backTrack, filter) {
    if (!backTrack) throw new Error("Error fetching logs, missing backTrack");

    const requestMessage = new RequestMessage(this.client, "GetAdminLog", {
      ...(backTrack && { LogBackTrackTime: backTrack }),
      ...(filter && { Filters: filter })
    });

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200) {
      const logs = response.contentBody.entries.map(entry => this._parseEntry(entry));

      return {
        success: true,
        logs
      };
    } else
      return {
        success: false,
        error: response.contentBody
      };
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
      this.client.emit(parsed.type, { ...parsed })
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
