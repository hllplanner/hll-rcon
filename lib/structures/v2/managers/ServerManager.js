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
   * @returns {Promise<{ success: boolean, error?: string }>}
   * @throws {Error} - If cooldown is NaN.
   */
  async setTeamSwitchCooldown(cooldown) {
    if (typeof cooldown !== "number" || isNaN(cooldown) || !Number.isInteger(cooldown)) throw new Error("Error setting team switch cooldown, cooldown must be an integer.");

    const requestMessage = new RequestMessage(this.client, "SetTeamSwitchCooldown", {
      TeamSwitchTimer: cooldown
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
   * Sets the maximum queue length.
   *
   * @param {number} count - The amount of slots in the queue. 1-6.
   * @returns {Promise<{ success: boolean, error?: string }>}
   * @throws {Error} - If count is NaN or not 1-6.
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
   * Gets the max queued players.
   *
   * @returns {Promise<{ success: boolean, error?: string, maxQueueCount?: number }>}
   */
  async getMaxQueuedPlayers() {
    const requestMessage = new RequestMessage(this.client, "GetServerInformation", {
      Name: "session"
    });

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200)
      return {
        success: true,
        maxQueueCount: parseInt(response.contentBody.maxQueueCount)
      };
    else
      return {
        success: false,
        error: response.contentBody
      };
  }

  /**
   * Sets cooldown for idle kick.
   * Set to 0 to disable.
   *
   * @param {number} cooldown - The duration in minutes for a player to be idle before being kicked.
   * @returns {Promise<{ success: boolean, error?: string }>}
   * @throws {Error} - If cooldown is missing or not an integer.
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
   * Sets the high ping threshold.
   * Set to 0 to disable.
   *
   * @param {number} time - The ping in milliseconds.
   * @returns {Promise<{ success: boolean, error?: string }>}
   * @throws {Error} - If time is missing or not an integer.
   */
  async setPingThreshold(time) {
    if (time === undefined) throw new Error("Error setting high ping threshold, missing time.");
    if (typeof time !== "number" || !Number.isInteger(time)) throw new Error("Error setting high ping threshold, ping must be an integer.");

    const requestMessage = new RequestMessage(this.client, "SetHighPingThreshold", {
      HighPingThresholdMs: time
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
   * Gets the current and maximum player count.
   *
   * @returns {Promise<{ success: boolean, error?: string, current?: number, maxiumum?: number }>}
   */
  async getSlots() {
    const requestMessage = new RequestMessage(this.client, "GetServerInformation", {
      Name: "session"
    });

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200) {
      const { playerCount, maxPlayerCount } = response.contentBody;
      return {
        success: true,
        current: playerCount,
        maximum: maxPlayerCount
      };
    } else
      return {
        success: false,
        error: response.contentBody
      };
  }

  /**
   * Gets the server name.
   *
   * @returns {Promise<{ success: boolean, error?: string, name?: string }>}
   */
  async getServerName() {
    const requestMessage = new RequestMessage(this.client, "GetServerInformation", {
      Name: "session"
    });

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200)
      return {
        success: true,
        name: response.contentBody.serverName
      };
    else
      return {
        success: false,
        error: response.contentBody
      };
  }

  /**
   * Sets the welcome message shown in loadout menu and when spawning in.
   *
   * @param {string} message - The welcome message.
   * @returns {Promise<{ success: boolean, error?: string }>}
   * @throws {Error} - If no message is given.
   */
  async setWelcomeMessage(message) {
    if (!message) throw new Error("Error setting server message, no message provided.");

    const requestMessage = new RequestMessage(this.client, "SendServerMessage", {
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
   * Enables or disables auto balancing.
   *
   * @param {number} enable - Whether or not to enable the auto balance feature.
   * @returns {Promise<{ success: boolean, error?: string }>}
   * @throws {Error} - If no parameter is given.
   */
  async setAutoBalanceEnabled(enable) {
    if (typeof enable !== "boolean") throw new Error("Error toggling auto balance, missing new state.");

    const requestMessage = new RequestMessage(this.client, "SetAutoBalanceEnabled", {
      EnableAutoBalance: enable
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
   * Sets the auto balancing threshold.
   * The threshold is the biggest difference between player counts in each teach before players are forced to the lower team to even player count.
   *
   * @param {number} difference - The difference in player counts.
   * @returns {Promise<{ success: boolean, error?: string }>}
   * @throws {Error} - If difference is not a number.
   */
  async setAutoBalanceThreshold(difference) {
    if (typeof difference !== "number") throw new Error("Error setting auto balance threshold, difference must be a number.");

    const requestMessage = new RequestMessage(this.client, "SetAutoBalanceThreshold", {
      AutoBalanceThreshold: difference
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
   * Enables or disables vote kicking.
   *
   * @param {boolean} enable - Whether or not to enable vote kicks.
   * @returns {Promise<{ success: boolean, error?: string }>}
   * @throws {Error} - If enable is not a boolean.
   */
  async setVoteKicksEnabled(enable) {
    if (typeof enable !== "boolean") throw new Error("Error toggling vote kicks, enable is not a boolean");

    const requestMessage = new RequestMessage(this.client, "SetVoteKickEnabled", {
      Enabled: enable
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
   * Set the vote kick thresholds.
   *
   * @param {Array<Array<number>>} thresholds - The thresholds.
   * @returns {Promise<{ success: boolean, error?: string }>}
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

    const requestMessage = new RequestMessage(this.client, "SetVoteKickThreshold", {
      ThresholdValue: sorted.flat().join(",")
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
   * Resets the vote kick thresholds to a blank string. It is not recommended to use this.
   *
   * @deprecated It is not recommended to use this.
   * @returns {Promise<{ success: boolean, error?: string }>}
   */
  async resetVoteKickThresholds() {
    const requestMessage = new RequestMessage(this.client, "ResetVoteKickThreshold");

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
   * Gets the server configuration.
   *
   * @returns {Promise<{ success: boolean, error?: string, config?: { serverName: string, buildNumber: string, buildRevision: string, supportedPlatforms: Array<string>, passwordProtected: boolean } }>}
   */
  async getConfiguration() {
    const requestMessage = new RequestMessage(this.client, "GetServerInformation", { Name: "serverconfig" });

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200)
      return {
        success: true,
        config: response.contentBody
      };
    else
      return {
        success: false,
        error: response.contentBody
      };
  }

  /**
   * Lists custom profanities
   *
   * @returns {Promise<{ success: boolean, error?: string, bannedWords?: Array<string>}>}
   */
  async listProfanities() {
    const requestMessage = new RequestMessage(this.client, "GetServerInformation", { Name: "bannedwords" });

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200)
      return {
        success: true,
        bannedWords: response.contentBody.bannedWords
      };
    else
      return {
        success: false,
        error: response.contentBody
      };
  }

  /**
   * Add a list of profanities to the server.
   *
   * @param {Array<string>} profanities - A list of profanities to add.
   * @returns {Promise<{ success: boolean, error?: string }>}
   * @throws {Error} If profanities is not an array.
   */
  async addProfanities(profanities) {
    if (!Array.isArray(profanities)) throw new Error("Error adding profanities, must be array");

    const requestMessage = new RequestMessage(this.client, "AddBannedWords", { BannedWords: profanities.join(",") });

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
   * Removes a list of profanities to the server.
   *
   * @param {Array<string>} profanities - A list of profanities to remove.
   * @returns {Promise<{ success: boolean, error?: string }>}
   * @throws {Error} If profanities is not an array.
   */
  async removeProfanities(profanities) {
    if (!Array.isArray(profanities)) throw new Error("Error removing profanities, must be array");

    const requestMessage = new RequestMessage(this.client, "RemoveBannedWords", { BannedWords: profanities.join(",") });

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
   * Sets match timer length for a specified gamemode.
   *
   * @param {string} gamemode - The gamemode to set the timer for.
   * @param {number} duration - The length, in minutes.
   * @returns {Promise<{ success: boolean, error?: string }>}
   * @throws {Error} If invalid gamemode is provided or length is invalid for specified gamemode.
   */
  async setMatchLength(gamemode, duration) {
    if (!gamemode) throw new Error("Error setting match timer length, missing gamemode.");
    if (!duration) throw new Error("Error setting match timer length, missing duration.");

    if (!["warfare", "offensive", "skirmish"].includes(gamemode.toLowerCase())) throw new Error(`Error setting match timer length, ${gamemode} is an invalid gamemode.`);

    switch (gamemode.toLowerCase()) {
      case "warfare": {
        if (duration < 30 || duration > 180) throw new Error("Error setting match length timer, durations for warfare must be between 30-180.");
        break;
      }

      case "offensive": {
        if (duration < 10 || duration > 60) throw new Error("Error setting match timer length, durations for offensive must be between 10-60.");
        break;
      }

      case "skirmish": {
        if (duration < 10 || duration > 60) throw new Error("Error setting match timer length, durations for skirmish must be between 10-60.");
        break;
      }
    }

    const requestMessage = new RequestMessage(this.client, "SetMatchTimer", {
      GameMode: gamemode,
      MatchLength: duration
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
   * Removes custom match timer length from a specified gamemode.
   *
   * @param {string} gamemode - The gamemode to remove the timer from.
   * @returns {Promise<{ success: boolean, error?: string }>}
   * @throws {Error} If the gamemode is invalid.
   */
  async resetMatchLength(gamemode) {
    if (!["warfare", "offensive", "skirmish"].includes(gamemode.toLowerCase())) throw new Error(`Error resetting match timer length, ${gamemode} is an invalid gamemode.`);

    const requestMessage = new RequestMessage(this.client, "RemoveMatchTimer", {
      GameMode: gamemode,
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
   * Sets match warmup timer for a specified gamemode.
   *
   * @param {string} gamemode - The gamemode to set the timer for.
   * @param {number} duration - The length, in minutes.
   * @returns {Promise<{ success: boolean, error?: string }>}
   * @throws {Error} If invalid gamemode is provided or length is invalid.
   */
  async setWarmupLength(gamemode, duration) {
    if (!gamemode) throw new Error("Error setting match warmup timer length, missing gamemode.");
    if (!duration) throw new Error("Error setting match warmup timer length, missing duration.");

    if (!["warfare", "skirmish"].includes(gamemode.toLowerCase())) throw new Error(`Error setting match warmup timer length, ${gamemode} is an invalid gamemode.`);
    if(duration < 1 || duration > 10) throw new Error("Error setting match warmup timer length, duration must be between 1-10");

    const requestMessage = new RequestMessage(this.client, "SetWarmupTimer", {
      GameMode: gamemode,
      WarmupLength: duration
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
   * Removes custom match warmup timer length from a specified gamemode.
   *
   * @param {string} gamemode - The gamemode to remove the timer from.
   * @returns {Promise<{ success: boolean, error?: string }>}
   * @throws {Error} If the gamemode is invalid.
   */
  async resetWarmupLength(gamemode) {
    if (!["warfare", "skirmish"].includes(gamemode.toLowerCase())) throw new Error(`Error setting match warmup timer length, ${gamemode} is an invalid gamemode.`);

    const requestMessage = new RequestMessage(this.client, "RemoveWarmupTimer", {
      GameMode: gamemode,
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
   * Sets the VIP slot count.
   *
   * @param {number} count - The amount of vip slots.
   * @returns {Promise<{ success: boolean, error?: string }>}
   */
  async setVIPSlotCount(count) {
    const requestMessage = new RequestMessage(this.client, "SetVipSlotCount", {
      VipSlotCount: count,
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

module.exports = ServerManager;