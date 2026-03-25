const RequestMessage = require("../RequestMessage");

/**
 * The controller responsible for managing players through RCONv2.
 *
 * @class
 * @property {RCONClient} client - The RCON client instance.
 */
class PlayerManager {
  client;

  /**
   * Creates an instance of PlayerManager.
   *
   * @param {RCONClient} client - The RCON client instance.
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Fetches all players from the server.
   *
   * @returns {Promise<{ success: boolean, error?: string, players?: Array<Player> }>}
   */
  async fetch() {
    const requestMessage = new RequestMessage(this.client, "GetServerInformation", {
      Name: "players"
    });

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200)
      return {
        success: true,
        players: response.contentBody.players
      };
    else
      return {
        success: false,
        error: response.contentBody
      };
  }

  /**
   * Gets information about a specific player.
   *
   * @param {string} playerId - The ID of the player to fetch.
   * @returns {Promise<{ success: boolean, error?: string, player?: Player }>}
   * @throws {Error} - If `playerId` is missing.
   */
  async get(playerId) {
    if (!playerId) throw new Error("Error getting player information, missing playerID.");

    const requestMessage = new RequestMessage(this.client, "GetServerInformation", {
      Name: "player",
      Value: playerId.toString()
    });

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200)
      return {
        success: true,
        player: response.contentBody
      };
    else
      return {
        success: false,
        error: response.contentBody
      };
  }

  /**
   * Sends a message to a specific player.
   *
   * @param {string} playerId - The ID of the player to message.
   * @param {string} message - The message to send.
   * @returns {Promise<{ success: boolean, error?: string }>}
   * @throws {Error} - If `playerId` or `message` are missing.
   */
  async message(playerId, message) {
    if (!playerId || !message) throw new Error("Error messaging player, missing one of: playerId, message.");

    const requestMessage = new RequestMessage(this.client, "MessagePlayer", {
      PlayerId: playerId,
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

  /**
   * Punishes a player for a given reason.
   *
   * @param {string} playerId - The ID of the player to punish.
   * @param {string} [reason] - The reason for punishment.
   * @returns {Promise<{ success: boolean, error?: string }>}
   * @throws {Error} - If `playerId` is missing
   */
  async punish(playerId, reason) {
    if (!playerId) throw new Error("Error punishing player, missing reason.");

    const requestMessage = new RequestMessage(this.client, "PunishPlayer", {
      PlayerId: playerId,
      Reason: reason
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
   * Kicks a player from the server.
   *
   * @param {string} playerId - The ID of the player to kick.
   * @param {string} [reason] - The reason for kicking the player.
   * @returns {Promise<{ success: boolean, error?: string }>}
   * @throws {Error} - If `playerId` is missing.
   */
  async kick(playerId, reason) {
    if (!playerId) throw new Error("Error kicking player, missing playerId.");

    const requestMessage = new RequestMessage(this.client, "KickPlayer", {
      PlayerId: playerId,
      Reason: reason
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
   * Temporarily bans a player from the server.
   *
   * @param {string} playerId - The ID of the player to ban.
   * @param {number} duration - The duration of the ban in hours.
   * @param {string} [reason] - The reason for the ban.
   * @param {string} [adminName] - The name of the admin issuing the ban.
   * @returns {Promise<{ success: boolean, error?: string }>}
   * @throws {Error} - If `playerId` or `duration` is missing.
   */
  async tempBan(playerId, duration, reason, adminName) {
    if (!playerId || !duration) throw new Error("Error temporarily banning player, missing playerId or duration.");

    const requestMessage = new RequestMessage(this.client, "TemporaryBanPlayer", {
      PlayerId: playerId,
      Duration: duration,
      Reason: reason,
      AdminName: adminName
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
   * Removes a temporary ban from a player.
   *
   * @param {string} playerId - The ID of the player to unban.
   * @returns {Promise<{ success: boolean, error?: string }>}
   * @throws {Error} - If `playerId` is missing.
   */
  async removeTempBan(playerId) {
    if (!playerId) throw new Error("Error removing temporary ban, missing playerId");

    const requestMessage = new RequestMessage(this.client, "RemoveTempBan", {
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
   * Retrieves all temporary bans.
   *
   * @returns {Promise<{ success: boolean, error?: string, tempBans: Array<{ userId: string, userName: string, timeOfBanning: string, durationHours: number, banReason: string, adminName: string }> }>}
   */
  async listTempBans() {
    const requestMessage = new RequestMessage(this.client, "GetTemporaryBans");

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200)
      return {
        success: true,
        tempBans: response.contentBody.banList
      };
    else
      return {
        success: false,
        error: response.contentBody
      };
  }

  /**
   * Permanently bans a player from the server.
   *
   * @param {string} playerId - The ID of the player to ban.
   * @param {string} [reason] - The reason for the ban.
   * @param {string} [adminName] - The name of the admin issuing the ban.
   * @returns {Promise<{ success: boolean, error?: string }>}
   * @throws {Error} - If playerId is missing.
   */
  async permaBan(playerId, reason, adminName) {
    if (!playerId) throw new Error("Error banning player, missing playerId.");

    const requestMessage = new RequestMessage(this.client, "PermanentBanPlayer", {
      PlayerId: playerId,
      Reason: reason,
      AdminName: adminName
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
   * Removes a permanent ban from a player.
   *
   * @param {string} playerId - The ID of the player to unban.
   * @returns {Promise<{ success: boolean, error?: string }>}
   * @throws {Error} - If `playerId` is missing.
   */
  async removePermaBan(playerId) {
    if (!playerId) throw new Error("Error removing ban, missing playerId.");

    const requestMessage = new RequestMessage(this.client, "RemovePermanentBan", {
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
   * Retrieves all permanent bans.
   *
   * @returns {Promise<{ success: boolean, error?: string, tempBans: Array<{ userId: string, userName: string, timeOfBanning: string, durationHours: number, banReason: string, adminName: string }> }>}
   */
  async listPermaBans() {
    const requestMessage = new RequestMessage(this.client, "GetPermanentBans");

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200)
      return {
        success: true,
        tempBans: response.contentBody.banList
      };
    else
      return {
        success: false,
        error: response.contentBody
      };
  }

  /**
   * Adds a VIP player to the server.
   *
   * @param {string} playerId - The ID of the player to add as VIP.
   * @param {string} nickname - The nickname to associate with the VIP player.
   * @returns {Promise<{ success: boolean, error?: string }>}
   * @throws {Error} If playerId or nickname is missing.
   */
  async addVIP(playerId, nickname) {
    if (!playerId) throw new Error("Error adding VIP, missing player ID.");
    if (!nickname) throw new Error("Error adding VIP, missing nickname.");

    const requestMessage = new RequestMessage(this.client, "AddVip", {
      PlayerId: playerId,
      Comment: nickname
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
   * Removes a VIP player from the server.
   *
   * @param {string} playerId - The ID of the player to remove from VIP.
   * @returns {Promise<{ success: boolean, error?: string }>}
   * @throws {Error} If playerId is missing.
   */
  async removeVIP(playerId) {
    if (!playerId) throw new Error("Error adding VIP, missing player ID.");

    const requestMessage = new RequestMessage(this.client, "RemoveVip", {
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
   * Forces a team switch on death.
   *
   * @param {string} playerId - The ID of the player to switch teams for.
   * @returns {Promise<{ success: boolean, error?: string }>}
   * @throws {Error} If playerId is missing.
   */
  async switchTeamOnDeath(playerId) {
    if (!playerId) throw new Error("Error switching player team, missing player ID.");

    const requestMessage = new RequestMessage(this.client, "ForceTeamSwitch", {
      PlayerId: playerId,
      ForceMode: 0
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
   * Forces a team switch immediately.
   *
   * @param {string} playerId - The ID of the player to switch teams for.
   * @returns {Promise<{ success: boolean, error?: string }>}
   * @throws {Error} If playerId is missing.
   */
  async switchTeamNow(playerId) {
    if (!playerId) throw new Error("Error switching player team, missing player ID.");

    const requestMessage = new RequestMessage(this.client, "ForceTeamSwitch", {
      PlayerId: playerId,
      ForceMode: 1
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
   * Remove a player from their unit.
   *
   * @param {string} playerId - The ID of the player to remove.
   * @returns {Promise<{ success: boolean, error?: string }>}
   * @throws {Error} If playerId is missing.
   * @throws {Error} If reason is missing.
   */
  async removePlayerFromUnit(playerId, reason) {
    if (!playerId) throw new Error("Error removing player from unit, missing playerId.");
    if (!playerId) throw new Error("Error removing player from unit, missing reason.");

    const requestMessage = new RequestMessage(this.client, "RemovePlayerFromPlatoon", {
      PlayerId: playerId,
      Reason: reason
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
   * Disbands a platoon (squad) by removing all players from it.
   *
   * @param {number} teamIndex - The index of the team (uint8).
   * @param {number} squadIndex - The index of the squad/platoon (int32).
   * @param {string} reason - The reason for disbanding the platoon.
   * @returns {Promise<{ success: boolean, error?: string }>}
   * @throws {Error} If any argument is missing.
   */
  async disbandPlatoon(teamIndex, squadIndex, reason) {
    if (teamIndex === undefined || squadIndex === undefined || !reason) {
      throw new Error("Error disbanding platoon, missing one of: teamIndex, squadIndex, reason.");
    }

    const requestMessage = new RequestMessage(this.client, "DisbandPlatoon", {
      TeamIndex: teamIndex,
      SquadIndex: squadIndex,
      Reason: reason
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

module.exports = PlayerManager;