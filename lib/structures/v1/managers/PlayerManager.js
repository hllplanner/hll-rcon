const List = require("../../List");
const intoQuotes = require("../../../utils/intoQuotes");

class PlayerManager {
  client;

  constructor(client) {
    this.client = client;
  }

  // Deprecated - use fetchPlayerIds
  async fetchPlayerNames() {
    const response = await this.client._send("Get Players");

    const responseList = new List(response);

    return responseList;
  }

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

  async message(playerId, message) {
    if (!playerId) throw new Error("Error messaging player, missing player ID.");
    if (!message) throw new Error("Error messaging player, missing message.");
    if (playerId.includes(" ")) throw new Error("Player ID should not include spaces."); // https://gist.github.com/OneAndOnlyFinbar/ad41a69c3544becf89bbc671690b1f9d#message-player-message

    const response = await this.client._send(`Message ${intoQuotes(playerId)} ${message}`);

    return response;
  }

  async punish(playerName, reason) {
    if (!playerName) throw new Error("Error punishing player, missing player name.");

    const response = await this.client._send(`Punish ${intoQuotes(playerName)} ${reason ? intoQuotes(reason) : ""}`);

    return response;
  }

  async kick(playerId, reason) {
    if (!playerId) throw new Error("Missing player ID");

    const response = await this.client._send(`Kick ${intoQuotes(playerId)} ${reason ? intoQuotes(reason) : ""}`);

    return response;
  }

  // If no duration is given it default to 2hrs
  async tempBan(playerId, duration = 2, reason, adminName) {
    if (!playerId) throw new Error("Error temporarily banning player, missing player ID.");
    if (adminName && !reason) throw new Error("Error temporarily banning player, must provide reason if an admin name is also provided.");

    const response = await this.client._send(`TempBan ${intoQuotes(playerId)} ${duration} ${reason ? intoQuotes(reason) : ""} ${adminName ? intoQuotes(adminName) : ""}`);

    return response;
  }

  async removeTempBan(playerId) {
    if (!playerId) throw new Error("Error removing temporary ban, missing player ID.");

    const response = await this.client._send(`PardonTempBan ${playerId}`);

    return response;
  }

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

      const [identifier, nickname, duration, year, month, day, hour, minute, second, reason, admin] = regexp.exec(tempBan).slice(1,12);
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

  async permaBan(playerId, reason, adminName) {
  }

  async removePermaBan(playerId) {
  }

  async listPermaBans() {
  }

  async forceTeamSwitchOnDeath(playerId) {
  }

  async forceImmediateTeamSwitch(playerId) {
  }
}

module.exports = PlayerManager;