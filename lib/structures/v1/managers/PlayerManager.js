const List = require("../../List");
const intoQuotes = require("../../../utils/intoQuotes");

/**
 * The controller responsible for managing players through RCONv1.
 *
 * @class
 * @property {RCONClientV1} client - The RCON v1 client instance.
 */
class PlayerManager {
  client;

  /**
   * Creates an instance of PlayerManager.
   *
   * @param {RCONClientV1} client - The RCON v1 client instance.
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Fetches a list of player names from the server.
   *
   * @returns {Promise<List>} A promise that resolves with a List of player names.
   * @deprecated use fetchPlayerIds instead.
   */
  async fetchPlayerNames() {
    const response = await this.client._send("Get Players");
    return new List(response);
  }

  /**
   * Fetches a list of player IDs and names from the server.
   *
   * @returns {Promise<Array<{playerName: string, playerId: string}>>} A promise that resolves with an array of player objects.
   */
  async fetchPlayerIds() {
    const response = await this.client._send("Get PlayerIds");

    const responseList = new List(response);
    const formatted = responseList.elements.map(player => {
      const regexp = /(.*) : (.*)/;
      const [playerName, playerId] = regexp.exec(player).slice(1, 3);

      return {
        playerName,
        playerId
      };
    });

    return formatted;
  }

  /**
   * Retrieves detailed information about a player by name.
   *
   * @param {string} playerName - The name of the player to retrieve.
   * @returns {Promise<Object|null>} A promise that resolves with the player info object, or null if not found.
   * @throws {Error} If playerName is missing or response is invalid.
   */
  async get(playerName) {
    if (!playerName) throw new Error("Error getting player info, missing player name.");

    let response = await this.client._send(`PlayerInfo ${playerName}`);
    if (response === "FAIL") return null;
    response = response.replaceAll("\n", "\\n");

    const regexp = /^Name: (.*?)\\nsteamID64: (.*?)\\nTeam: (Allies|Axis|None)\\nRole: (.*?)(?:\\nUnit: (?:(\d*?) - (.*?)))?(?:\\nLoadout: (.*?))?\\nKills: (\d*?) - Deaths: (\d*?)\\nScore: C (\d.*?), O (\d.*?), D (\d.*?), S (\d.*?)\\nLevel: (\d*)/;
    if (!response.match(regexp))
      throw new Error(`Invalid player info string: ${response}`);

    const [retrievedPlayerName, playerId, playerTeam, playerRole, playerUnitId, playerUnitName, playerLoadout, kills, deaths, combatScore, offensiveScore, defensiveScore, supportScore] = regexp.exec(response).slice(1, 14);

    return {
      playerName: retrievedPlayerName,
      playerId,
      playerTeam,
      playerRole,
      playerUnitId: playerUnitId ? Number(playerUnitId) : null,
      playerUnitName,
      playerLoadout,
      kills: Number(kills),
      deaths: Number(deaths),
      combatScore: Number(combatScore),
      offensiveScore: Number(offensiveScore),
      defensiveScore: Number(defensiveScore),
      supportScore: Number(supportScore)
    };
  }

  /**
   * Sends a message to a player by their ID.
   *
   * @param {string} playerId - The ID of the player to message.
   * @param {string} message - The message to send.
   * @returns {Promise<"SUCCESS" | "FAIL">} A promise that resolves with the server's response.
   * @throws {Error} If playerId or message is missing, or playerId contains spaces.
   */
  async message(playerId, message) {
    if (!playerId) throw new Error("Error messaging player, missing player ID.");
    if (!message) throw new Error("Error messaging player, missing message.");
    if (playerId.includes(" ")) throw new Error("Player ID should not include spaces."); // https://gist.github.com/OneAndOnlyFinbar/ad41a69c3544becf89bbc671690b1f9d#message-player-message

    return this.client._send(`Message ${intoQuotes(playerId)} ${message}`);
  }

  /**
   * Punishes a player by name with an optional reason.
   *
   * @param {string} playerName - The name of the player to punish.
   * @param {string} [reason] - The reason for punishment.
   * @returns {Promise<"SUCCESS" | "FAIL">} A promise that resolves with the server's response.
   * @throws {Error} If playerName is missing.
   */
  async punish(playerName, reason) {
    if (!playerName) throw new Error("Error punishing player, missing player name.");

    return this.client._send(`Punish ${intoQuotes(playerName)} ${reason ? intoQuotes(reason) : ""}`);
  }

  /**
   * Kicks a player by their ID with an optional reason.
   *
   * @param {string} playerId - The ID of the player to kick.
   * @param {string} [reason] - The reason for kicking.
   * @returns {Promise<"SUCCESS" | "FAIL">} A promise that resolves with the server's response.
   * @throws {Error} If playerId is missing.
   */
  async kick(playerId, reason) {
    if (!playerId) throw new Error("Missing player ID");

    return this.client._send(`Kick ${intoQuotes(playerId)} ${reason ? intoQuotes(reason) : ""}`);
  }

  /**
   * Temporarily bans a player by their ID.
   *
   * @param {string} playerId - The ID of the player to ban.
   * @param {number} [duration=2] - The duration of the ban in hours.
   * @param {string} [reason] - The reason for the ban.
   * @param {string} [adminName] - The name of the admin issuing the ban.
   * @returns {Promise<"SUCCESS" | "FAIL">} A promise that resolves with the server's response.
   * @throws {Error} If playerId is missing, or if adminName is provided without a reason.
   */
  async tempBan(playerId, duration = 2, reason, adminName) {
    if (!playerId) throw new Error("Error temporarily banning player, missing player ID.");
    if (adminName && !reason) throw new Error("Error temporarily banning player, must provide a reason if an admin name is also provided.");

    return this.client._send(`TempBan ${intoQuotes(playerId)} ${duration} ${reason ? intoQuotes(reason) : ""} ${adminName ? intoQuotes(adminName) : ""}`);
  }

  /**
   * Removes a temporary ban from a player by their ID.
   *
   * @param {string} playerId - The ID of the player to unban.
   * @returns {Promise<"SUCCESS" | "FAIL">} A promise that resolves with the server's response.
   * @throws {Error} If playerId is missing.
   */
  async removeTempBan(playerId) {
    if (!playerId) throw new Error("Error removing temporary ban, missing player ID.");

    return this.client._send(`PardonTempBan ${playerId}`);
  }

  /**
   * Retrieves a list of all temporary bans.
   *
   * @returns {Promise<Array<Object>>} A promise that resolves with an array of temp ban objects.
   */
  async listTempBans() {
    const response = await this.client._send("Get TempBans");

    const list = new List(response);
    const regexp = /(.*?) : (?:nickname "(.*?)" )?banned for (\d*?) hours on (\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2})(?: for "(.*?)")?(?: by admin "(.*?)")?/;

    const formatted = [];
    for (let tempBan of list.elements) {
      if (!regexp.test(tempBan)) {
        console.error(`Error parsing temp ban: ${tempBan}`);
        continue;
      }

      const [identifier, nickname, duration, year, month, day, hour, minute, second, reason, admin] = regexp.exec(tempBan).slice(1, 12);
      const date = new Date(year, month - 1, day, hour, minute, second);

      formatted.push({
        identifier,
        nickname,
        duration,
        date,
        reason,
        admin
      });
    }

    return formatted;
  }

  /**
   * Permanently bans a player by their ID.
   *
   * @param {string} playerId - The ID of the player to ban.
   * @param {string} [reason] - The reason for the ban.
   * @param {string} [adminName] - The name of the admin issuing the ban.
   * @returns {Promise<"SUCCESS" | "FAIL">} A promise that resolves with the server's response.
   * @throws {Error} If playerId is missing, or if adminName is provided without a reason.
   */
  async permaBan(playerId, reason, adminName) {
    if (!playerId) throw new Error("Error permanently banning player, missing player ID.");
    if (adminName && !reason) throw new Error("Error permanently banning player, must provide a reason if an admin name is also provided.");

    return this.client._send(`PermaBan ${intoQuotes(playerId)} ${intoQuotes(reason || "")} ${intoQuotes(adminName || "")}`);
  }

  /**
   * Removes a permanent ban from a player by their ID.
   *
   * @param {string} playerId - The ID of the player to unban.
   * @returns {Promise<"SUCCESS" | "FAIL">} A promise that resolves with the server's response.
   * @throws {Error} If playerId is missing.
   */
  async removePermaBan(playerId) {
    if (!playerId) throw new Error("Error removing permanent ban, missing player ID.");

    return this.client._send(`PardonPermaBan ${playerId}`);
  }

  /**
   * Retrieves a list of all permanent bans.
   *
   * @returns {Promise<Array<Object>>} A promise that resolves with an array of perma ban objects.
   */
  async listPermaBans() {
    const response = await this.client._send("Get PermaBans");

    const list = new List(response);
    const regexp = /(.*?) : (?:nickname "(.*?)" )?banned on (\d{4})\.(\d{2})\.(\d{2})-(\d{2})\.(\d{2})\.(\d{2})(?: for "(.*?)")?(?: by admin "(.*?)")?/;

    const formatted = [];
    for (let permaBan of list.elements) {
      if (!regexp.test(permaBan)) {
        console.error(`Error parsing perma ban: ${permaBan}`);
        continue;
      }

      const [identifier, nickname, year, month, day, hour, minute, second, reason, admin] = regexp.exec(permaBan).slice(1, 12);
      const date = new Date(year, month - 1, day, hour, minute, second);

      formatted.push({
        identifier,
        nickname,
        date,
        reason,
        admin
      });
    }

    return formatted;
  }

  /**
   * Forces a team switch for a player on death.
   *
   * @param {string} playerName - The name of the player to switch teams.
   * @returns {Promise<"SUCCESS" | "FAIL">} A promise that resolves with the server's response.
   * @throws {Error} If playerName is missing.
   */
  async switchTeamOnDeath(playerName) {
    if (!playerName) throw new Error("Error forcing team switch on death, missing player name.");

    return this.client._send(`SwitchTeamOnDeath ${playerName}`);
  }

  /**
   * Immediately forces a team switch for a player.
   *
   * @param {string} playerName - The name of the player to switch teams.
   * @returns {Promise<"SUCCESS" | "FAIL">} A promise that resolves with the server's response.
   * @throws {Error} If playerName is missing.
   */
  async switchTeamNow(playerName) {
    if (!playerName) throw new Error("Error forcing team switch, missing player name.");

    return this.client._send(`SwitchTeamNow ${playerName}`);
  }

  /**
   * Adds a VIP player to the server.
   *
   * @param {string} playerId - The ID of the player to add as VIP.
   * @param {string} nickname - The nickname to associate with the VIP player.
   * @returns {Promise<"SUCCESS" | "FAIL">} A promise that resolves with the server's response.
   * @throws {Error} If playerId or nickname is missing.
   */
  async addVIP(playerId, nickname) {
    if (!playerId) throw new Error("Error adding VIP, missing player ID.");
    if (!nickname) throw new Error("Error adding VIP, missing nickname.");

    return this.client._send(`VipAdd ${intoQuotes(playerId)} ${intoQuotes(nickname || "")}`);
  }

  /**
   * Removes a VIP player from the server.
   *
   * @param {string} playerId - The ID of the player to remove from VIP.
   * @returns {Promise<"SUCCESS" | "FAIL">} A promise that resolves with the server's response.
   * @throws {Error} If playerId is missing.
   */
  async removeVIP(playerId) {
    if (!playerId) throw new Error("Error removing VIP, missing player ID.");

    return await this.client._send(`VipDel ${playerId}`);
  }

  /**
   * Retrieves a list of all VIP players.
   *
   * @returns {Promise<Array<{playerId: string, nickname: string}>>} A promise that resolves with an array of VIP player objects.
   */
  async listVIPS() {
    const response = await this.client._send("Get VipIds");

    const list = new List(response);
    const regexp = /(.*?) "(.*?)"/;

    const formatted = [];
    for (let vip of list.elements) {
      if (!regexp.test(vip)) {
        console.error(`Error parsing vip: ${vip}`);
        continue;
      }

      const [playerId, nickname] = regexp.exec(vip).slice(1, 3);

      formatted.push({
        playerId,
        nickname
      });
    }

    return formatted;
  }
}

module.exports = PlayerManager;