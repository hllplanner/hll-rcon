const RequestMessage = require("../RequestMessage");

/**
 * The controller responsible for managing admins through RCONv2.
 *
 * @class
 * @property {RCONClientV2} client - The RCON v2 client instance.
 */
class AdminManager {
  client;

  /**
   * Creates an instance of AdminManager.
   *
   * @param {RCONClientV2} client - The RCON v2 client instance.
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Adds an admin to the server.
   *
   * @param {string|number} playerId - The ID of the player to add as an admin.
   * @param {string} group - The admin group to assign the player to.
   * @param {string} [comment] - An optional comment for the admin.
   * @returns {Promise<boolean>} - Returns true on success
   * @throws {Error} If the server responds with an error.
   */
  async add(playerId, group, comment) {
    const requestMessage = new RequestMessage(this.client, "AddAdmin", {
      PlayerId: playerId,
      AdminGroup: group,
      Comment: comment
    });

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200)
      return true;
    else
      throw new Error(`Error adding admin: ${response.stringify()}`);
  }

  /**
   * Removes an admin from the server.
   *
   * @param {string|number} playerId - The ID of the player to remove as an admin.
   * @returns {Promise<boolean>} - Returns true on success
   * @throws {Error} - If the server responds with an error.
   */
  async remove(playerId) {
    const requestMessage = new RequestMessage(this.client, "RemoveAdmin", {
      PlayerId: playerId
    });

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200)
      return true;
    else
      throw new Error(`Error removing admin: ${response.stringify()}`);
  }
}

module.exports = AdminManager;