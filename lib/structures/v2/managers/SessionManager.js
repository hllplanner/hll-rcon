const RequestMessage = require("../RequestMessage");
const Maps = require("../../../utils/constants");
const { intoQuotes } = require("../../../utils/intoQuotes");

/**
 * The controller responsible for managing the active game session for RCONv1.
 *
 * @class
 * @property {RCONClientV2} client - The RCONv2 client instance.
 */
class SessionManager {
  client;

  /**
   * Creates an instance of SessionManager.
   *
   * @param {RCONClientV2} client - The RCONv2 client instance.
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Get the session object from the server.
   * @returns {Promise<{ serverName: string, mapName: string, gameMode: string, playerCount: number,
   *                     maxPlayerCount: number, queueCount: number, maxQueueCount: number, vIPQueueCount: number, maxVIPQueueCount: number
   *                     }>
   *          }
   * @throws {Error} - If the server responds with an error.
   */
  async getSession() {
    const requestMessage = new RequestMessage(this.client, "ServerInformation", {
      Name: "session"
    });

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200)
      return response.contentBody;
    else
      throw new Error(`Error getting session: ${JSON.stringify(response)}`);
  }

  /**
   * Sets the map.
   *
   * @param {string}
   * @returns {Promise<boolean>} - Returns true on success
   * @throws {Error} - If the server responds with an error.
   */
  async setMap(id) {
    const requestMessage = new RequestMessage(this.client, "ChangeMap", {
      MapName: id
    });

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200)
      return true;
    else
      throw new Error(`Error setting map: ${JSON.stringify(response)}`);
  }

  /**
   * Sets the sector layout.
   *
   * @param {Array<string>} layout - The new sector layout, an array of strings which are the names of the sectors.
   * @returns {Promise<boolean>} - Returns true on success
   * @throws {Error} - If the server responds with an error.
   */
  async setSectorLayout(layout) {
    const [Sector_1, Sector_2, Sector_3, Sector_4, Sector_5] = layout.map(sp => intoQuotes(sp));

    const requestMessage = new RequestMessage(this.client, "ChangeSectorLayout", {
      Sector_1,
      Sector_2,
      Sector_3,
      Sector_4,
      Sector_5
    });

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200)
      return true;
    else
      throw new Error(`Error changing sector layout: ${JSON.stringify(response)}`);
  }

  /**
   * Sets the welcome message shown in loadout menu and when spawning in.
   *
   * @param {string} message - The welcome message.
   * @returns {Promise<boolean>} - Returns true on success.
   * @throws {Error} - If the server responds with an error.
   */
  async setWelcomeMessage(message) {
    const requestMessage = new RequestMessage(this.client, "SendServerMessage", {
      Message: message
    });

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200)
      return true;
    else
      throw new Error(`Error sending server message: ${JSON.stringify(response)}`);
  }

  /**
   * Broadcast a message to the server. This is the "admin message" shown in the top left. Leave the message parameter empty to clear the broadcast.
   *
   * @param {string} message - The welcome message.
   * @returns {Promise<boolean>} - Returns true on success.
   * @throws {Error} - If the server responds with an error.
   */
  async broadcastMessage(message) {
    if (!message) message = " ";

    const requestMessage = new RequestMessage(this.client, "ServerBroadcast", {
      Message: message
    });

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200)
      return true;
    else
      throw new Error(`Error broadcasting message: ${JSON.stringify(response)}`);
  }
}

module.exports = SessionManager;