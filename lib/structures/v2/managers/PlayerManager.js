const RequestMessage = require("../RequestMessage");

class PlayerManager {
  client;

  constructor(client) {
    this.client = client;
  }

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