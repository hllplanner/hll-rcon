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
   * @param {string} playerId - The ID of the player to add as an admin.
   * @param {string} group - The admin group to assign the player to.
   * @param {string} [comment] - An optional comment for the admin.
   * @returns {Promise<{ success: boolean, error?: string }>}
   * @throws {Error} - If `playerId` or `group` parameters are missing.
   */
  async add(playerId, group, comment) {
    if (!playerId || !group) throw new Error("Error adding admin, missing one of: playerId, group");

    const requestMessage = new RequestMessage(this.client, "AddAdmin", {
      PlayerId: playerId,
      AdminGroup: group,
      Comment: comment
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
   * Removes an admin from the server.
   *
   * @param {string} playerId - The ID of the player to remove as an admin.
   * @returns {Promise<{ success: boolean, error?: string }>}
   * @throws {Error} - If `playerId` is missing.
   */
  async remove(playerId) {
    if (!playerId) throw new Error("Error removing admin, missing playerId");

    const requestMessage = new RequestMessage(this.client, "RemoveAdmin", {
      PlayerId: playerId
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
   * Retrieves admins groups.
   *
   * @returns {Promise<{ success: boolean, error?: string, groups?: Array<string> }>}
   */
  async listGroups() {
    const requestMessage = new RequestMessage(this.client, "GetAdminGroups");

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200)
      return {
        success: true,
        groups: response.contentBody.groupNames
      };
    else
      return {
        success: false,
        error: response.contentBody
      };
  }

  /**
   * Retrieves admins users.
   *
   * @returns {Promise<{ success: boolean, error?: string, users?: Array<{ userId: string, group: string, comment: string }> }>}
   */
  async listUsers() {
    const requestMessage = new RequestMessage(this.client, "GetAdminUsers");

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200)
      return {
        success: true,
        users: response.contentBody.adminUsers
      };
    else
      return {
        success: false,
        error: response.contentBody
      };
  }
}

module.exports = AdminManager;