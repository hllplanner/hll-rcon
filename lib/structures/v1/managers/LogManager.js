const parseLogEntry = require("../../../utils/parseLogEntry");
const crypto = require("crypto");

class LogManager {
  client;
  cache = new Map();

  constructor(client) {
    this.client = client;
  }

  async fetch(backTrack, filter = "") {
    const response = await this.client._send(`ShowLog ${backTrack} ${filter}`);

    const escapeRegex = /\n(?!\[.+? \(\d+\)\])/g;
    const escaped = response.replace(escapeRegex, "\\n");

    const parsed = escaped.split('\n').map(log => this._parseEntry(log));

    return parsed;
  }

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

  _hashLog(parsedLog) {
    return crypto.createHash("sha256").update(JSON.stringify(parsedLog)).digest("hex");
  }
}

module.exports = LogManager;