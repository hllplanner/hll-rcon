export class PlayerManager {
  client;

  constructor(client) {
    this.client = client;
  }

  async list() {}

  async get(playerId) {}

  async message(playerId, message) {}

  async punish(playerId, reason) {}

  async kick(playerId, reason) {}

  async tempBan(playerId, duration, reason, adminName) {}

  async removeTempBan(playerId) {}

  async listTempBans() {}

  async permaBan(playerId, reason, adminName) {}

  async removePermaBan(playerId) {}

  async listPermaBans() {}

  async forceTeamSwitchOnDeath(playerId) {}

  async forceImmediateTeamSwitch(playerId) {}
}