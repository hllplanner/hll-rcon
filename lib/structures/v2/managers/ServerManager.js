const RequestMessage = require("../RequestMessage");

/**
 * The controller responsible for managing the server through RCONv2.
 *
 * @class
 * @property {RCONClientV2} client - The RCON v2 client instance.
 */
class ServerManager {
  client;

  /**
   * Creates an instance of ServerManager.
   *
   * @param {RCONClientV2} client - The RCON v2 client instance.
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Sets the cooldown for switching teams.
   *
   * @param {number} cooldown - The amount of minutes to set the team switch cooldown to.
   * @returns {Promise<ResponseMessage>}
   * @throws {Error} If cooldown is NaN.
   * @deprecated This seems to be broken in RCONv2 - Use RCONv1 equivalent.
   */
  async setTeamSwitchCooldown(cooldown) {
    if (typeof cooldown !== "number" || isNaN(cooldown) || !Number.isInteger(cooldown)) throw new Error("Error setting team switch cooldown, cooldown must be an integer.");

    const requestMessage = new RequestMessage(this.client, "TeamSwitchCooldown", {
      TeamSwitchTimer: cooldown
    });

    return this.client._send(requestMessage);
  }

  /**
   * Sets the maximum queue length
   *
   * @param {number} count - The amount of slots in the queue. 1-6.
   * @returns {Promise<ResponseMessage>}
   * @throws {Error} count is NaN or not 1-6.
   * @deprecated This seems to be broken in RCONv2 - Use RCONv1 equivalent.
   */
  async setMaxQueuedPlayers(count) {
    if (typeof count !== "number" || isNaN(count) || !Number.isInteger(count)) throw new Error("Error setting max queue, count must be an integer.");
    if (count < 1 || count > 6) throw new Error("Error setting max queue, count must be from 1-6");

    const requestMessage = new RequestMessage(this.client, "SetMaxQueuedPlayers", {
      MaxQueuedPlayers: count
    });

    return this.client._send(requestMessage);
  }

  async getMaxQueuedPlayers() {
  }

  async setIdleKickCooldown() {
  }

  async setPingThreshold() {
  }

  async getSlots() {
  }

  async getServerName() {
  }

  async setAutoBalanceEnabled() {
  }

  async setAutoBalanceEnabled() {
  }

  async setVoteKicksEnabled() {
  }

  async setVoteKickThresholds() {
  }

  async resetVoteKickThresholds() {
  }
}

module.exports = ServerManager;