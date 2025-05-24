const RequestMessage = require("../RequestMessage");

/**
 * The controller responsible for managing players through RCONv2.
 *
 * @class
 * @property {RCONClientV2} client - The RCON v2 client instance.
 */
class PlayerManager {
  client;

  /**
   * Creates an instance of PlayerManager.
   *
   * @param {RCONClientV2} client - The RCON v2 client instance.
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Fetches all players from the server.
   *
   * @returns {Promise<Array<Object>>} - Resolves with an array of player objects.
   * @throws {Error} - If the server responds with an error.
   */
  async fetch() {
    const requestMessage = new RequestMessage(this.client, "ServerInformation", {
      Name: "players"
    });

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200)
      return response.contentBody;
    else
      throw new Error(`Error fetching players: ${response.stringify()}`);
  }

  /**
   * Gets information about a specific player.
   *
   * @param {string|number} playerId - The ID of the player to fetch.
   * @returns {Promise<Object>} - Resolves with the player object.
   * @throws {Error} - If the server responds with an error.
   */
  async get(playerId) {
    const requestMessage = new RequestMessage(this.client, "ServerInformation", {
      Name: "player",
      Value: playerId
    });

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200)
      return response.contentBody;
    else
      throw new Error(`Error fetching player: ${response.stringify()}`);
  }

  /**
   * Sends a message to a specific player.
   *
   * @param {string|number} playerId - The ID of the player to message.
   * @param {string} message - The message to send.
   * @returns {Promise<boolean>} - Returns true on success.
   * @throws {Error} - If the server responds with an error.
   */
  async message(playerId, message) {
    const requestMessage = new RequestMessage(this.client, "MessagePlayer", {
      PlayerId: playerId,
      Message: message
    });

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200)
      return true;
    else
      throw new Error(`Error messaging player: ${response.stringify()}`);
  }

  /**
   * Punishes a player for a given reason.
   *
   * @param {string|number} playerId - The ID of the player to punish.
   * @param {string} reason - The reason for punishment.
   * @returns {Promise<boolean>} - Returns true on success.
   * @throws {Error} - If the server responds with an error.
   */
  async punish(playerId, reason) {
    const requestMessage = new RequestMessage(this.client, "PunishPlayer", {
      PlayerId: playerId,
      Reason: reason
    });

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200)
      return true;
    else
      throw new Error(`Error punishing player: ${response.stringify()}`);
  }

  /**
   * Kicks a player from the server.
   *
   * @param {string|number} playerId - The ID of the player to kick.
   * @param {string} reason - The reason for kicking the player.
   * @returns {Promise<boolean>} - Returns true on success.
   * @throws {Error} - If the server responds with an error.
   */
  async kick(playerId, reason) {
    const requestMessage = new RequestMessage(this.client, "Kick", {
      PlayerId: playerId,
      Reason: reason
    });

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200)
      return true;
    else
      throw new Error(`Error kicking player: ${response.stringify()}`);
  }

  /**
   * Temporarily bans a player from the server.
   *
   * @param {string|number} playerId - The ID of the player to ban.
   * @param {number} duration - The duration of the ban in seconds.
   * @param {string} reason - The reason for the ban.
   * @param {string} adminName - The name of the admin issuing the ban.
   * @returns {Promise<boolean>} - Returns true on success.
   * @throws {Error} - If the server responds with an error.
   */
  async tempBan(playerId, duration, reason, adminName) {
    const requestMessage = new RequestMessage(this.client, "TempBan", {
      PlayerId: playerId,
      Duration: duration,
      Reason: reason,
      AdminName: adminName
    });

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200)
      return true;
    else
      throw new Error(`Error applying temp ban: ${response.stringify()}`);
  }

  /**
   * Removes a temporary ban from a player.
   *
   * @param {string|number} playerId - The ID of the player to unban.
   * @returns {Promise<boolean>} - Returns true on success.
   * @throws {Error} - If the server responds with an error.
   */
  async removeTempBan(playerId) {
    const requestMessage = new RequestMessage(this.client, "RemoveTempBan", {
      PlayerId: playerId
    });

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200)
      return true;
    else
      throw new Error(`Error removing temp ban: ${response.stringify()}`);
  }

  /**
   * Permanently bans a player from the server.
   *
   * @param {string|number} playerId - The ID of the player to ban.
   * @param {string} reason - The reason for the ban.
   * @param {string} adminName - The name of the admin issuing the ban.
   * @returns {Promise<boolean>} - Returns true on success.
   * @throws {Error} - If the server responds with an error.
   */
  async ban(playerId, reason, adminName) {
    const requestMessage = new RequestMessage(this.client, "PermanentBan", {
      PlayerId: playerId,
      Reason: reason,
      AdminName: adminName
    });

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200)
      return true;
    else
      throw new Error(`Error applying ban: ${response.stringify()}`);
  }

  /**
   * Removes a permanent ban from a player.
   *
   * @param {string|number} playerId - The ID of the player to unban.
   * @returns {Promise<boolean>} - Returns true on success.
   * @throws {Error} - If the server responds with an error.
   */
  async removeBan(playerId) {
    const requestMessage = new RequestMessage(this.client, "RemovePermanentBan", {
      PlayerId: playerId
    });

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200)
      return true;
    else
      throw new Error(`Error removing ban: ${response.stringify()}`);
  }
}

module.exports = PlayerManager;