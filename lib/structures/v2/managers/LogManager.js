const RequestMessage = require("../RequestMessage");
const parseLogEntry = require("../../../utils/parseLogEntry");
const crypto = require('crypto');

class LogManager {
  client;
  cache = new Map();

  constructor(client) {
    this.client = client;
  }

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

  // TODO: Vote log entries
  _parseEntry(entry) {
    const parsed = parseLogEntry(entry);
    const id = this._hashLog(parsed);

    if(!this.cache.get(id)) {
      this.cache.set(id, parsed);
      console.log(this.cache)
    }

    return parsed;
  }

  _hashLog(parsedLog) {
    return crypto.createHash("sha256").update(JSON.stringify(parsedLog)).digest("hex");
  }
}

module.exports = LogManager;