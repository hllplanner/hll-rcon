const List = require("../../List");

/**
 * The controller responsible for managing maps through RCONv1.
 *
 * @class
 * @property {RCONClientV1} client - The RCON v1 client instance.
 */
class ServerManager {
  client;

  /**
   * Creates an instance of ServerManager.
   *
   * @param {RCONClientV1} client - The RCONv1 client instance.
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Sets cooldown for switching teams.
   *
   * @param {number} cooldown - The duration in minutes for switching teams.
   * @returns {Promise<"SUCCESS" | "FAIL">}
   * @throws {Error} If cooldown is missing or not an integer.
   */
  async setTeamSwitchCooldown(cooldown) {
    if (cooldown === undefined) throw new Error("Error setting team switch cooldown, missing cooldown duration.");
    if (!Number.isInteger(cooldown)) throw new Error("Error setting team switch cooldown, duration must be an integer.");

    return this.client._send(`SetTeamSwitchCooldown ${cooldown}`, { shortResponse: true });
  }

  /**
   * Gets the cooldown for switching teams.
   *
   * @returns {Promise<number>} - The team switch cooldown.
   */
  async getTeamSwitchCooldown() {
    const response = await this.client._send("Get TeamSwitchCooldown");
    return parseInt(response);
  }

  /**
   * Sets max queued players.
   *
   * @param {number} count - The maximum queue size.
   * @returns {Promise<"SUCCESS" | "FAIL">}
   * @throws {Error} If count is missing, not an integer, or not 1-6.
   */
  async setMaxQueuedPlayers(count) {
    if (count === undefined) throw new Error("Error setting max queued players, missing count.");
    if (!Number.isInteger(count)) throw new Error("Error setting max queued players, count must be an integer.");
    if (count < 1 || count > 6) throw new Error(`Error setting max queued players, must be between 1 and 6, got ${count}`);

    return this.client._send(`SetMaxQueuedPlayers ${count}`, { shortResponse: true });
  }

  /**
   * Gets the maximum queued players count.
   *
   * @returns {Promise<number>} - The queue size.
   */
  async getMaxQueuedPlayers() {
    const response = await this.client._send("Get MaxQueuedPlayers");
    return parseInt(response);
  }

  /**
   * Sets cooldown for idle kick.
   * Set to 0 to disable.
   *
   * @param {number} cooldown - The duration in minutes for a player to be idle before being kicked.
   * @returns {Promise<"SUCCESS" | "FAIL">}
   * @throws {Error} If cooldown is missing or not an integer.
   */
  async setIdleKickCooldown(cooldown) {
    if (cooldown === undefined) throw new Error("Error setting idle kick cooldown, missing cooldown duration.");
    if (!Number.isInteger(cooldown)) throw new Error("Error setting idle kick cooldown, duration must be an integer.");

    return this.client._send(`SetKickIdleTime ${cooldown}`, { shortResponse: true });
  }

  /**
   * Gets the cooldown for idle kick.
   *
   * @returns {Promise<number>} - The idle kick duration.
   */
  async getIdleKickCooldown() {
    const response = await this.client._send("Get IdleTime");
    return parseInt(response);
  }

  /**
   * Sets the high ping threshold.
   * Set to 0 to disable.
   *
   * @param {number} time - The ping in milliseconds.
   * @returns {Promise<"SUCCESS" | "FAIL">}
   * @throws {Error} If time is missing or not an integer.
   */
  async setPingThreshold(time) {
    if (time === undefined) throw new Error("Error setting idle kick threshold, missing time.");
    if (!Number.isInteger(time)) throw new Error("Error setting idle kick time, threshold must be an integer.");

    return this.client._send(`SetHighPing ${time}`, { shortResponse: true });
  }

  /**
   * Gets the cooldown for idle kick.
   *
   * @returns {Promise<number>} - The idle kick duration.
   */
  async getPingThreshold() {
    const response = await this.client._send("Get HighPing");
    return (response);
  }

  /**
   * Gets the currently occupied and maximum player slots.
   *
   * @returns {Promise<{ current: number, maximum: number }>} - The currently occupied and maximum number of slots.
   */
  async getSlots() {
    const response = await this.client._send("Get Slots");
    const [current, maximum] = response.split("/").map(s => parseInt(s));
    return {
      current,
      maximum
    };
  }

  /**
   * Sets the server's welcome message.
   *
   * @param {string} message - The welcome message.
   * @returns {Promise<"SUCCESS" | "FAIL">}
   * */
  async setWelcomeMessage(message) {
    return this.client._send(`Say ${message}`, { shortResponse: true });
  }

  /**
   * Gets the server's name.
   *
   * @returns {Promise<string>} - The currently occupied and maximum number of slots.
   */
  async getServerName() {
    return this.client._send(`Get Name`);
  }

  /**
   * Enables or disables auto balancing.
   *
   * @param enable - Whether or not to enable or disable auto balancing.
   * @returns {Promise<"SUCCESS" | "FAIL">}
   * @throws {Error} If enable isn't a boolean.
   */
  async setAutoBalanceEnabled(enable) {
    if (typeof enable !== "boolean") throw new Error("Error setting auto balance enabled, enable parameter must be a boolean.");
    return this.client._send(`SetAutoBalanceEnabled ${enable ? "on" : "off"}`, { shortResponse: true });
  }

  /**
   * Checks if auto balancing is enabled.
   *
   * @returns {Promise<boolean>}
   */
  async getAutoBalanceEnabled() {
    const response = await this.client._send("Get AutoBalanceEnabled");
    return response === "on";
  }

  /**
   * Sets the auto balancing threshold.
   * The threshold is the biggest difference between player counts in each teach before players are forced to the lower team to even player count.
   *
   * @param {number} difference - The difference in player counts.
   * @returns {Promise<"SUCCESS" | "FAIL">}
   * @throws {Error} If difference is not a number.
   */
  async setAutoBalanceThreshold(difference) {
    if (typeof difference !== "number") throw new Error("Error setting auto balance threshold, difference must be a number.");

    return this.client._send(`SetAutoBalanceThreshold ${difference}`, { shortResponse: true });
  }

  /**
   * Gets the auto balancing threshold.
   *
   * @returns {Promise<number>}
   */
  async getAutoBalanceThreshold() {
    const response = await this.client._send("Get AutoBalanceThreshold");
    return parseInt(response);
  }

  /**
   * Allow or disallow vote kicks to be initiated.
   *
   * @param {boolean} enable - Enable vote kicks
   * @returns {Promise<"SUCCESS" | "FAIL">}
   * @throws {Error} If enable is not a boolean.
   */
  async setVoteKicksEnabled(enable) {
    if (typeof enable !== "boolean") throw new Error("Error setting vote kicks enabled, enable parameter must be a boolean.");

    return this.client._send(`SetVoteKickEnabled ${enable ? "on" : "off"}`, { shortResponse: true });
  }

  /**
   * Checks if vote kicks are enabled on the server.
   *
   * @returns {Promise<boolean>}
   */
  async getVoteKicksEnabled() {
    const response = await this.client._send("Get VoteKickEnabled");
    return response === "on";
  }

  /**
   * Sets vote thresholds.
   *
   * @param thresholds {Array<Array<number>>} - The threshold configuration.
   * @returns {Promise<"SUCCESS" | "FAIL">}
   * @throws {Error} If thresholds is not a 2d-array with each subarray containing 2 numbers.
   * @throws {Error} If a threshold for 0 players is not given.
   * @throws {Error} If for any threshold the player count is less than the vote count.
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

    return this.client._send(`SetVoteKickThreshold ${thresholds.flat()}`, { shortResponse: true });
  }

  /**
   * Gets the vote kick thresholds.
   *
   * @returns {Promise<Array<Array<number>>>}
   */
  async getVoteKickThresholds() {
    const response = await this.client._send("Get VoteKickThreshold");

    // This happens after resetting the vote kick threshold.
    if (response === " ") return [];

    const components = response.split(",").map(c => parseInt(c));
    let result = [];

    for (let i = 0; i < components.length; i += 2) {
      result.push([components[i], components[i + 1]]);
    }


    return result;
  }

  /**
   * Resets the vote kick thresholds to a blank string. It is not recommended to use this.
   *
   * @deprecated It is not recommended to use this.
   * @returns {Promise<"SUCCESS" | "FAIL">}
   */
  async resetVoteKickThresholds() {
    return this.client._send("ResetVoteKickThreshold", { shortResponse: true });
  }

  /**
   * Sets the RCON password.
   *
   * @param {string} oldPassword - The old/current RCON password.
   * @param {string} newPassword - The new RCON password.
   * @returns {Promise<"SUCCESS" | "FAIL">}
   */
  async setRCONPassword(oldPassword, newPassword) {
    return this.client._send(`RconPassword ${oldPassword} ${newPassword}`, { shortResponse: true });
  }

  /**
   * Sets the number of reserved VIP slots.
   *
   * @param {number} count - The amount of slots reserved for VIPs.
   * @returns {Promise<"SUCCESS" | "FAIL">}
   * @throws {Error} If count is not a number.
   * */
  async setVIPSlotCount(count) {
    if (typeof count !== "number") throw new Error("Error setting VIP slot count, count must be a number.");

    return this.client._send(`SetNumVipSlots ${count}`, { shortResponse: true });
  }

  /**
   * Gets the number of reserved VIP slots.
   *
   * @returns {Promise<number>}
   */
  async getVIPSlotCount() {
    const response = await this.client._send("Get NumVipSlots");
    return parseInt(response);
  }

  /**
   * Lists custom profanities.
   *
   * @returns {Promise<List>}
   */
  async listProfanities() {
    const response = await this.client._send("Get Profanity");

    return new List(response);
  }

  /**
   * Add a list of profanities to the server.
   *
   * @param {Array<string>} profanities - A list of profanities to add.
   * @returns {Promise<"SUCCESS" | "FAIL">}
   * @throws {Error} If profanities is not an array.
   */
  async addProfanities(profanities) {
    if (!Array.isArray(profanities)) throw new Error("Error adding profanities, must be array");

    return this.client._send(`BanProfanity ${profanities.join(",")}`, { shortResponse: true });
  }

  /**
   * Remove a list of profanities from the server.
   *
   * @param {Array<string>} profanities
   * @returns {Promise<"SUCCESS" | "FAIL">}
   * @throws {Error} If profanities is not an array.
   */
  async removeProfanities(profanities) {
    if (!Array.isArray(profanities)) throw new Error("Error removing profanities, must be array");

    return this.client._send(`UnbanProfanity ${profanities.join(",")}`, { shortResponse: true });
  }
}

module.exports = ServerManager;