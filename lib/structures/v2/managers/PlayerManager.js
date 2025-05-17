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

  async permaBan(playerId, reason, adminName) {}

  async removePermaBan(playerId) {}
}