const RequestMessage = require("../RequestMessage");
const Maps = require("../../utils/constants");
const intoQuotes = require("../../utils/intoQuotes");

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
   * @returns {Promise<{
   success: boolean,
   error?: string,
   session?: {
   serverName: string,
   mapName: string,
   gameMode: string,
   playerCount: number,
   maxPlayerCount: number,
   queueCount: number,
   maxQueueCount: number,
   vipQueueCount: number,
   maxVipQueueCount: number
   }
   }>}
   * @throws {Error} - If the server responds with an error.
   */
  async getSession() {
    const requestMessage = new RequestMessage(this.client, "GetServerInformation", {
      Name: "session"
    });

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200)
      return {
        success: true,
        session: response.contentBody
      };
    else
      return {
        success: false,
        error: response.contentBody
      };
  }

  /**
   * Sets the map.
   *
   * @param {string}
   * @returns {Promise<{ success: boolean, error?: string }>}
   * @throws {Error} - If `id` is missing.
   */
  async setMap(id) {
    const requestMessage = new RequestMessage(this.client, "ChangeMap", {
      MapName: id
    });

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200)
      return {
        success: true
      };
    else
      return {
        success: false,
        error: response.contentBody
      };
  }

  /**
   * Sets the sector layout.
   *
   * @param {Array<string>} layout - The new sector layout, an array of strings which are the names of the sectors.
   * @returns {Promise<{ success: boolean, error?: string }>}
   * @throws {Error} - If sectors are missing or not strings.
   */
  async setSectorLayout(layout) {
    if (!Array.isArray(layout) || layout.length !== 5 || layout.some(s => typeof s !== "string")) throw new Error("Error setting sector layout, expecting an array of 5 strings.");

    const [Sector_1, Sector_2, Sector_3, Sector_4, Sector_5] = layout;

    const requestMessage = new RequestMessage(this.client, "SetSectorLayout", {
      Sector_1,
      Sector_2,
      Sector_3,
      Sector_4,
      Sector_5
    });

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200)
      return {
        success: true
      };
    else
      return {
        success: false,
        error: response.contentBody
      };
  }

  /**
   * Broadcast a message to the server. This is the "admin message" shown in the top left. Leave the message parameter empty to clear the broadcast.
   *
   * @param {string} [message] - The welcome message. Leave blank to clear the message.
   * @returns {Promise<{ success: boolean, error?: string }>}
   */
  async broadcastMessage(message) {
    if (!message) message = " ";

    const requestMessage = new RequestMessage(this.client, "ServerBroadcast", {
      Message: message
    });

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200)
      return {
        success: true
      };
    else
      return {
        success: false,
        error: response.contentBody
      };
  }
}

module.exports = SessionManager;