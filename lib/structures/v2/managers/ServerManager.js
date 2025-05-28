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
   * @returns {Promise<boolean>} - Returns true on success.
   * @throws {Error} - If cooldown is NaN.
   * @throws {Error} - If the server responds with an error.
   * @deprecated This seems to be broken in RCONv2 - Use RCONv1 equivalent.
   */
  async setTeamSwitchCooldown(cooldown) {
    if (typeof cooldown !== "number" || isNaN(cooldown) || !Number.isInteger(cooldown)) throw new Error("Error setting team switch cooldown, cooldown must be an integer.");

    const requestMessage = new RequestMessage(this.client, "TeamSwitchCooldown", {
      TeamSwitchTimer: cooldown
    });

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200)
      return true;
    else
      throw new Error(`Error setting team switch cooldown: ${response.stringify()}`);
  }

  /**
   * Sets the maximum queue length.
   *
   * @param {number} count - The amount of slots in the queue. 1-6.
   * @returns {Promise<boolean>} - Returns true on success.
   * @throws {Error} - If count is NaN or not 1-6.
   * @throws {Error} - If the server responds with an error.
   * @deprecated This seems to be broken in RCONv2 - Use RCONv1 equivalent.
   */
  async setMaxQueuedPlayers(count) {
    if (typeof count !== "number" || isNaN(count) || !Number.isInteger(count)) throw new Error("Error setting max queue, count must be an integer.");
    if (count < 1 || count > 6) throw new Error("Error setting max queue, count must be from 1-6");

    const requestMessage = new RequestMessage(this.client, "SetMaxQueuedPlayers", {
      MaxQueuedPlayers: count
    });

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200)
      return true;
    else
      throw new Error(`Error setting max queued players: ${response.stringify()}`);
  }

  /**
   * Gets the max queued players.
   *
   * @returns {Promise<number>} - The amount of seats in the queue.
   * @throws {Error} - If the server responds with an error.
   */
  async getMaxQueuedPlayers() {
    const requestMessage = new RequestMessage(this.client, "ServerInformation", {
      Name: "session"
    });

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200)
      return parseInt(response.contentBody.maxQueueCount);
    else
      throw new Error(`Error getting max queued players: ${response.stringify()}`);
  }

  /**
   * Sets cooldown for idle kick.
   * Set to 0 to disable.
   *
   * @param {number} cooldown - The duration in minutes for a player to be idle before being kicked.
   * @returns {Promise<boolean>} - Returns true on success.
   * @throws {Error} - If cooldown is missing or not an integer.
   * @throws {Error} - If the server responds with an error.
   * @deprecated This works, however you cant disable the idle kick by providing 0 as minutes - use RCONv1 equivalent.
   */
  async setIdleKickCooldown(cooldown) {
    if (cooldown === undefined) throw new Error("Error setting idle kick cooldown, missing cooldown duration.");
    if (!Number.isInteger(cooldown)) throw new Error("Error setting idle kick cooldown, duration must be an integer.");

    const requestMessage = new RequestMessage(this.client, "SetIdleKickDuration", {
      IdleTimeoutMinutes: cooldown
    });

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200)
      return true;
    else
      throw new Error(`Error setting idle kick cooldown: ${response.stringify()}`);
  }

  /**
   * Sets the high ping threshold.
   * Set to 0 to disable.
   *
   * @param {number} time - The ping in milliseconds.
   * @returns {Promise<boolean>} - Returns true on success.
   * @throws {Error} - If time is missing or not an integer.
   * @throws {Error} - If the server responds with an error.
   */
  async setPingThreshold(time) {
    if (time === undefined) throw new Error("Error setting high ping threshold, missing time.");
    if (typeof time !== "number" || !Number.isInteger(time)) throw new Error("Error setting high ping threshold, ping must be an integer.");

    const requestMessage = new RequestMessage(this.client, "SetHighPingThreshold", {
      HighPingThresholdMs: time
    });

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200)
      return true;
    else
      throw new Error(`Error setting high ping threshold: ${response.stringify()}`);
  }

  /**
   * Gets the current and maximum player count.
   *
   * @returns {Promise<{ current: number, maximum: number }>} - The current and maximum player counts.
   * @throws {Error} - If the server responds with an error.
   */
  async getSlots() {
    const requestMessage = new RequestMessage(this.client, "ServerInformation", {
      Name: "session"
    });

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200) {
      const { playerCount, maxPlayerCount } = response.contentBody;
      return {
        current: playerCount,
        maximum: maxPlayerCount
      };
    } else
      throw new Error(`Error getting slots: ${response.stringify()}`);
  }

  /**
   * Gets the server name.
   *
   * @returns {Promise<string>} - The server name.
   * @throws {Error} - If the server response with an error.
   */
  async getServerName() {
    const requestMessage = new RequestMessage(this.client, "ServerInformation", {
      Name: "session"
    });

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200) {
      return response.contentBody.serverName;
    } else
      throw new Error(`Error getting server name: ${response.stringify()}`);
  }

  /**
   * Sets the welcome message shown in loadout menu and when spawning in.
   *
   * @param {string} message - The welcome message.
   * @returns {Promise<boolean>} - Returns true on success.
   * @throws {Error} - If no message is given.
   * @throws {Error} - If the server responds with an error.
   */
  async setWelcomeMessage(message) {
    if (!message) throw new Error("Error setting server message, no message provided.");

    const requestMessage = new RequestMessage(this.client, "SendServerMessage", {
      Message: message
    });

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200)
      return true;
    else
      throw new Error(`Error sending server message: ${response.stringify()}`);
  }

  /**
   * Enables or disables auto balancing.
   *
   * @param {number} enable - Whether or not to enable the auto balance feature.
   * @returns {Promise<boolean>} - Returns true on success.
   * @throws {Error} - If no parameter is given.
   * @throws {Error} - If the server responds with an error.
   */
  async setAutoBalanceEnabled(enable) {
    if (typeof enable !== "boolean") throw new Error("Error toggling auto balance, missing new state.");

    const requestMessage = new RequestMessage(this.client, "AutoBalance", {
      EnableAutoBalance: enable
    });

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200)
      return true;
    else
      throw new Error(`Error toggling auto balance: ${response.stringify()}`);
  }

  /**
   * Sets the auto balancing threshold.
   * The threshold is the biggest difference between player counts in each teach before players are forced to the lower team to even player count.
   *
   * @param {number} difference - The difference in player counts.
   * @returns {Promise<boolean>} - Returns true on success.
   * @throws {Error} - If difference is not a number.
   * @throws {Error} - If the server responds with an error.
   */
  async setAutoBalanceThreshold(difference) {
    if (typeof difference !== "number") throw new Error("Error setting auto balance threshold, difference must be a number.");

    const requestMessage = new RequestMessage(this.client, "AutoBalanceThreshold", {
      AutoBalanceThreshold: difference
    });

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200)
      return true;
    else
      throw new Error(`Error setting auto balance threshold: ${response.stringify()}`);
  }

  /**
   * Enables or disables vote kicking.
   *
   * @param {boolean} enable - Whether or not to enable vote kicks.
   * @returns {Promise<boolean>} - Returns true on success.
   * @throws {Error} - If enable is not a boolean.
   * @throws {Error} - If the server responds with an error.
   */
  async setVoteKicksEnabled(enable) {
    if (typeof enable !== "boolean") throw new Error("Error toggling vote kicks, enable is not a boolean");

    const requestMessage = new RequestMessage(this.client, "VoteKickEnabled", {
      Enabled: enable
    });

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200)
      return true;
    else
      throw new Error(`Error toggling vote kicks: ${response.stringify()}`);
  }

  /**
   * Set the vote kick thresholds.
   *
   * @param {Array<Array<number>>} thresholds - The thresholds.
   * @returns {Promise<boolean>} - Returns true on success.
   * @throws {Error} If thresholds is not a 2d-array with each subarray containing 2 numbers.
   * @throws {Error} If a threshold for 0 players is not given.
   * @throws {Error} If for any threshold the player count is less than the vote count.
   * @throws {Error} - If the server responds with an error.
   */
  async setVoteKickThresholds(thresholds) {
    if (
      !Array.isArray(thresholds)
      || thresholds.some(t =>
        !Array.isArray(t)
        || t.length !== 2
        || t.some(e => typeof e !== "number")
      )
    ) throw new Error("Error setting vote kick thresholds, thresholds must be a 2d-array, each subarray must contain 2 numbers.");

    const sorted = thresholds.sort((pairA, pairB) => pairA[0] - pairB[0]);

    if (sorted[0][0] !== 0) throw new Error("Error setting vote kick threshold, must have a threshold case for 0 players.");
    if (sorted.some(pair => pair[0] !== 0 && pair[0] < pair[1])) throw new Error("Error setting vote kick threshold, minimum player count must be greater than vote count.");

    const requestMessage = new RequestMessage(this.client, "VoteKickThreshold", {
      ThresholdValue: sorted.flat().join(",")
    });

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200)
      return true;
    else
      throw new Error(`Error setting vote kick thresholds: ${response.stringify()}`);
  }

  /**
   * Resets the vote kick thresholds to a blank string. It is not recommended to use this.
   *
   * @deprecated It is not recommended to use this.
   * @returns {Promise<boolean>} - Returns true on success.
   * @throws {Error} - If the server response with an error.
   */
  async resetVoteKickThresholds() {
    const requestMessage = new RequestMessage(this.client, "ResetKickThreshold");

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200)
      return true;
    else
      throw new Error(`Error resetting vote to kick thresholds: ${response.stringify()}`);
  }
}

module.exports = ServerManager;