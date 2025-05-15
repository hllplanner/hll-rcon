/**
 * Represents a V2 message structure to send to the RCON server.
 *
 * @class
 *
 * @property {RCONClientV2} client - The RCON client instance associated with the message.
 * @property {string} name - The name of the message.
 * @property {Object|string|null} contentBody - The content body of the message, can be an object, string, or null.
 * @property {boolean} populated - Indicates whether the message has been populated with data.
 * @property {Object|null} populatedData - The populated data of the message, or null if not populated.
 */
class RequestMessage {
  client = null;
  name = null;
  contentBody = null;

  populated = false;
  populatedData = null;

  /**
   * Sends a message using the V2 client.
   *
   * @param {RequestMessage} message The message to send.
   * @returns {Promise<any>} A promise that resolves with the response from the server.
   */
  constructor(client, name, contentBody) {
    this.client = client;
    this.name = name;
    this.contentBody = contentBody;

    this.populate();
  }

  /**
   * Populates the message with the necessary data.
   * Throws an error if the message name is empty.
   * @throws {Error} If the message name is empty.
   */
  populate() {
    if (!this.name) throw new Error('Tried to populate empty message.');

    let ContentBody = this.contentBody || "";
    if (typeof this.contentBody === "object") ContentBody = JSON.stringify(this.contentBody);

    this.populated = true;
    this.populatedData = {
      AuthToken: this.client.authToken || "",
      Version: 2,
      Name: this.name,
      ContentBody
    }
  }

  /**
   * Wraps the populated message data into a JSON string.
   * Throws an error if the message is not populated.
   * @returns {string} The JSON string representation of the populated message data.
   * @throws {Error} If the message is not populated.
   */
  wrap() {
    if (!this.populated) throw new Error('Tried to wrap unpopulated message.');

    return JSON.stringify(this.populatedData);
  }
}

module.exports = RequestMessage;