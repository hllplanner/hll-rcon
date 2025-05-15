const RequestMessage = require('../RequestMessage');

class AdminManager {
  client;

  constructor(client) {
    this.client = client;
  }

  async add(playerId, group, comment) {
    const requestMessage = new RequestMessage(this.client, "AddAdmin", {
      PlayerId: playerId,
      AdminGroup: group,
      Comment: comment
    });

    const response = await this.client._send(requestMessage);

    if(response.statusCode === 200)
      return true;
    else
      throw new Error(`Error adding admin: ${JSON.stringify(response)}`)
  }

  async remove(playerId) {
    const requestMessage = new RequestMessage(this.client, "RemoveAdmin", {
      PlayerId: playerId
    });

    const response = await this.client._send(requestMessage);

    if(response.statusCode === 200)
      return true;
    else
      throw new Error(`Error removing admin: ${JSON.stringify(response)}`)
  }
}

module.exports = AdminManager;