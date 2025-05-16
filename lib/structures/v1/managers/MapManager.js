const List = require("../../List");
const { Maps } = require("../../../utils/constants");

/**
 * The controller responsible for managing maps through RCONv1.
 *
 * @class
 * @property {RCONClientV1} client - The RCON v1 client instance.
 */
class MapManager {
  client;

  /**
   * Creates an instance of MapManager.
   *
   * @param {RCONClientV1} client - The RCON v1 client instance.
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Retrieves all available maps for rotation.
   *
   * @returns {Promise<List>} A promise that resolves with a list of all maps.
   */
  async getAllMaps() {
    const response = await this.client._send("Get MapsForRotation");

    const responseList = new List(response);

    return responseList;
  }

  /**
   * Retrieves the maps currently in rotation.
   *
   * @returns {Promise<Array<string>>} A promise that resolves with an array of map names in rotation.
   */
  async getMapsInRotation() {
    const response = await this.client._send("RotList");

    const formatted = response.split("\n").filter(Boolean);

    return formatted;
  }

  /**
   * Adds a map to the rotation.
   *
   * @param {string} mapId - The ID of the map to add.
   * @param {string} [afterMap=""] - The ID of the map after which the new map should be added.
   * @param {string} [afterMapOrdinal=""] - The ordinal position after the specified map.
   * @returns {Promise<string>} A promise that resolves with the server's response.
   * @throws {Error} If `mapId` or `afterMap` is invalid.
   */
  async addMapToRotation(mapId, afterMap = "", afterMapOrdinal = "") {
    if (!Maps.includes(mapId)) throw new Error(`Error adding map to rotation, ${mapId} is not a valid map ID.`);
    if (afterMap && !Maps.includes(afterMap)) throw new Error(`Error adding map to rotation, ${afterMap} is not a valid map ID for afterMap.`);

    const response = await this.client._send(`RotAdd ${mapId} ${afterMap} ${afterMapOrdinal}`);

    return response;
  }

  /**
   * Removes a map from the rotation.
   *
   * @param {string} mapId - The ID of the map to remove.
   * @param {string} mapOrdinal - The ordinal position of the map to remove.
   * @returns {Promise<string>} A promise that resolves with the server's response.
   * @throws {Error} If `mapId` is invalid.
   */
  async removeMapFromRotation(mapId, mapOrdinal) {
    if (!Maps.includes(mapId)) throw new Error(`Error removing map from rotation, ${mapId} is not a valid map ID.`);

    const response = await this.client._send(`RotDel ${mapId}`);

    return response;
  }

  /**
   * Toggles map shuffling on or off.
   *
   * @returns {Promise<string>} A promise that resolves with the server's response.
   */
  async toggleMapShuffle() {
    const response = await this.client._send("ToggleMapShuffle");

    return response;
  }

  /**
   * Checks if map shuffling is enabled.
   *
   * @returns {Promise<boolean>} A promise that resolves with `true` if shuffling is enabled, otherwise `false`.
   */
  async getMapShufflingEnabled() {
    const response = await this.client._send("QueryMapShuffle");

    return response.includes("TRUE");
  }

  /**
   * Retrieves the current map sequence.
   *
   * @returns {Promise<Array<string>>} A promise that resolves with an array of map names in the current sequence.
   */
  async getMapSequence() {
    const response = await this.client._send("ListCurrentMapSequence");

    const formatted = response.split("\n").filter(Boolean);

    return formatted;
  }
}

module.exports = MapManager;