const List = require("../../List");
const intoQuotes = require('../../../utils/intoQuotes');

/**
 * The controller responsible for managing admins through RCONv1.
 *
 * @class
 * @property {RCONClientV1} client - The RCON v1 client instance.
 */
class AdminManager {
  client;

  /**
   * Creates an instance of AdminManager.
   *
   * @param {RCONClientV1} client - The RCON v1 client instance.
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
   * @returns {Promise<"SUCCESS" | "FAIL">} A promise that resolves with the server's response.
   * @throws {Error} If `playerId` or `group` is missing.
   */
  async add(playerId, group, comment) {
    if (!playerId) throw new Error("Error adding admin, missing player ID.");
    if (!group) throw new Error("Error adding admin, missing group.");

    return this.client._send(`AdminAdd ${intoQuotes("playerId")} ${intoQuotes("group")} ${intoQuotes(comment)}`, { shortResponse: true });
  }

  /**
   * Removes an admin from the server.
   *
   * @param {string} playerId - The ID of the player to remove as an admin.
   * @returns {Promise<"SUCCESS" | "FAIL">} A promise that resolves with the server's response.
   * @throws {Error} If `playerId` is missing.
   */
  async remove(playerId) {
    if (!playerId) throw new Error("Error adding admin, missing player ID.");

    return this.client._send(`AdminDel ${playerId}`, { shortResponse: true });
  }

  /**
   * Retrieves a list of all admins on the server.
   *
   * @returns {Promise<Array<{ playerId: string, group: string, comment: string|null }>>} A promise that resolves with a list of admins.
   */
  async list() {
    const response = await this.client._send("Get AdminIds");

    const responseList = new List(response);
    const formatted = responseList.elements.map(admin => {
      let [playerId, group, comment] = admin.split(" ");
      comment = comment ? comment.slice(1, -1) : null;

      return {
        playerId,
        group,
        comment
      };
    })

    return formatted;
  }

  /**
   * Retrieves list of admin groups.
   *
   * @returns {Promise<List>}
   */
  async listAdminGroups() {
    const response = await this.client._send("Get AdminGroups");
    return new List(response);
  }
}

module.exports = AdminManager;