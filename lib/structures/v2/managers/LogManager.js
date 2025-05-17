const RequestMessage = require('../RequestMessage');

class LogManager {
  client;

  constructor(client) {
    this.client = client;
  }

  async fetch(backTrack, filter) {
    const requestMessage = new RequestMessage(this.client, "AdminLog", {
      ...(backTrack && { LogBackTrackTime: backTrack }),
      ...(filter && { Filters: filter })
    });

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200)
      return response.contentBody;
    else
      throw new Error(`Error fetching logs: ${response.stringify()}`);
  }
}

module.exports = LogManager;