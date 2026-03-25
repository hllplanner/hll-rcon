/**
 * Represents a response message received from the RCON server.
 *
 * @class
 *
 * @property {RCONClient} client - The RCON client instance associated with the response.
 * @property {number} index - The index of the response message.
 * @property {number|null} statusCode - The status code of the response.
 * @property {string|null} statusMessage - The status message of the response.
 * @property {number} version - The version of the response message (default is 2).
 * @property {string|null} name - The name of the response message.
 * @property {Object|string|null} contentBody - The content body of the response, can be an object, string, or null.
 */
class ResponseMessage {
  client = null;
  index = null;
  rawData;

  statusCode = null;
  statusMessage = null;
  version = 2;
  name = null;
  contentBody = null;

  constructor(client, index, data) {
    this.client = client;
    this.index = index;
    this.rawData = data;

    Object.assign(this, data);
  }

  stringify () {
    return JSON.stringify(this.rawData);
  }
}

module.exports = ResponseMessage;