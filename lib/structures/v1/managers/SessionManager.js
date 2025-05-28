const { Maps } = require("../../../utils/constants");
const List = require("../../List");
const intoQuotes = require("../../../utils/intoQuotes");

/**
 * The controller responsible for managing the active game session for RCONv1.
 *
 * @class
 * @property {RCONClientV1} client - The RCONv2 client instance.
 */
class SessionManager {
  client;

  /**
   * Creates an instance of SessionManager.
   *
   * @param {RCONClientV1} client - The RCONv2 client instance.
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Sets the current map on the server.
   *
   * @param {string} mapId - The ID of the map to set.
   * @param {string} [ordinal] - The instance of said map if its in rotation more than once.
   * @returns {Promise<"SUCCESS" | "FAIL">} A promise that resolves with the server's response.
   * @throws {Error} - If the map ID is unknown.
   */
  async setMap(mapId, ordinal) {
    if (!Maps.includes(mapId)) throw new Error(`Unknown map ID: ${mapId}`);

    return this.client._send(`Map ${mapId} ${ordinal ? ordinal : ""}`);
  }

  /**
   * Retrieves the current map from the server.
   *
   * @returns {Promise<string>} - The current map ID.
   */
  async getMap() {
    return this.client._send("Get Map");
  }

  /**
   * Sets the sector layout for the game.
   *
   * @param {Array<string>} strongPoints - An array of 5 strong points to set.
   * @returns {Promise<"SUCCESS" | "FAIL">} A promise that resolves with the server's response.
   * @throws {Error} - If the number of strong points is not 5.
   */
  async setSectorLayout(strongPoints) {
    if (!Array.isArray(strongPoints) || strongPoints.length !== 5) throw new Error(`Must have 5 strong points, got ${strongPoints.length}: ${strongPoints}`);
    const mappedStrongPoints = strongPoints.map(sp => intoQuotes(sp));

    return this.client._send(`GameLayout ${mappedStrongPoints.join(" ")}`);
  }

  /**
   * Retrieves the sector layout from the server.
   *
   * @param {number|null} [sector=null] - The sector index (0-4) to retrieve, or null to retrieve all sectors.
   * @param {number} [inactivityTimeout=200] - The timeout duration for message inactivity.
   * @returns {Promise<List|Array<List>>} - A `List` of strong points for a single sector, or an array of `List` objects for all sectors.
   * @throws {Error} - If the sector index is invalid or NaN.
   */
  async getSectorLayout(sector = null, inactivityTimeout = 200) {
    if (sector !== null) {
      if (isNaN(sector)) throw new Error("Sector must be number");
      if (sector < 0 || sector > 4) throw new Error(`Sector index must be between 0 and 4.`);

      const response = await this.client._send(`Get ObjectiveRow_${sector}`);
      return new List(response);
    }

    const result = [];
    for (let i = 0; i < 5; i++) {
      const response = await this.client._send(`Get ObjectiveRow_${i}`, {
        // In testing, if this was set to 100 a row would be empty, if you experience this symptom increase the inactivityTimeout.
        inactivityTimeout
      });

      result.push(new List(response));
    }

    return result;
  }

  /**
   * Broadcasts a message to the server.
   *
   * @param {string} message - The message to broadcast. If empty, clears the broadcast.
   * @returns {Promise<"SUCCESS" | "FAIL">} A promise that resolves with the server's response.
   */
  async broadcastMessage(message) {
    // Clearing broadcast with "Broadcast " doesnt seem to work in RCONv1, use RCONv2 if needed.
    // Nonetheless, this bit will stay for if this is fixed in the future.
    if (!message) message = "";

    return this.client._send(`Broadcast ${message}`);
  }

  /**
   * Retrieves the current game state from the server.
   *
   * @returns {Promise<{ alliedPlayers: number, axisPlayers: number, alliesScore: number, axisScore: number, remainingTime: string, map: string, nextMap; string }>}
   */
  async getGameState() {
    const response = await this.client._send("Get GameState");

    const [playersRow, scoreRow, remainingTimeRow, mapRow, nextMapRow] = response.split("\n");

    const playersRegex = /Allied: (\d+) - Axis: (\d+)/;
    const scoreRegex = /Allied: (\d+) - Axis: (\d+)/;

    const playersMatch = playersRow.match(playersRegex);
    const scoreMatch = scoreRow.match(scoreRegex);

    const result = {
      alliedPlayers: parseInt(playersMatch[1]),
      axisPlayers: parseInt(playersMatch[2]),
      alliesScore: parseInt(scoreMatch[1]),
      axisScore: parseInt(scoreMatch[2]),
      remainingTime: remainingTimeRow.replace("Remaining Time: ", "").trim(),
      map: mapRow.replace("Map: ", "").trim(),
      nextMap: nextMapRow.replace("Next Map: ", "").trim()
    };

    return result;
  }
}

module.exports = SessionManager;