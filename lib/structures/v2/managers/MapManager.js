const RequestMessage = require("../RequestMessage");
const List = require("../../List");
const { Maps } = require("../../../utils/constants");

/**
 * The controller responsible for managing maps through RCONv2.
 *
 * @class
 * @property {RCONClientV2} client - The RCON v2 client instance.
 */
class MapManager {
  client;

  /**
   * Creates an instance of MapManager.
   *
   * @param {RCONClientV2} client - The RCON v2 client instance.
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Adds a map to the rotation at a specific index.
   *
   * @param {string} mapId - The ID of the map to add.
   * @param {number} [index] - The index at which to add the map. If no index it goes to the beginning.
   * @returns {Promise<{ success: boolean, error?: string }>}
   * @throws {Error} If `mapId` is invalid or `index` is negative.
   */
  async addMapToRotation(mapId, index) {
    if (!Maps.includes(mapId)) throw new Error(`Error adding map to rotation, ${mapId} is not a valid map ID.`);
    if (index && index < 0) throw new Error(`Index must be a nonnegative integer, received: ${index}`);

    const requestMessage = new RequestMessage(this.client, "AddMapToRotation", {
      MapName: mapId,
      Index: index
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
   * Removes a map from the rotation at a specific index.
   *
   * @param {number} index - The index of the map to remove.
   * @returns {Promise<{ success: boolean, error?: string }>}
   * @throws {Error} If `index` is not a nonnegative integer.
   */
  async removeMapFromRotation(index) {
    if (!Number.isInteger(index) || index < 0) throw new Error(`Index must be a nonnegative integer, received: ${index}`);

    const requestMessage = new RequestMessage(this.client, "RemoveMapFromRotation", {
      Index: index
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
   * Retrieves the current map sequence.
   *
   * @returns {Promise<{ success: boolean, error?: string, maps?: Array<string> }>}
   */
  async getMapSequence() {
    const requestMessage = new RequestMessage(this.client, "ServerInformation", {
      Name: "mapsequence"
    });

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200) {
      const maps = response.contentBody.mAPS;
      return {
        success: true,
        maps
      };
    } else
      return {
        success: false,
        error: response.contentBody
      };
  }

  /**
   * Adds a map to the sequence at a specific index.
   *
   * @param {string} mapId - The ID of the map to add.
   * @param {number} index - The index at which to add the map.
   * @returns {Promise<{ success: boolean, error?: string }>}
   * @throws {Error} If `mapId` is invalid or `index` is negative.
   */
  async addMapToSequence(mapId, index) {
    if (!Maps.includes(mapId)) throw new Error(`Error adding map to rotation, ${mapId} is not a valid map ID.`);
    if (!Number.isInteger(index) || index < 0) throw new Error(`Index must be a nonnegative integer, received: ${index}`);

    const requestMessage = new RequestMessage(this.client, "AddMapToSequence", {
      MapName: mapId,
      Index: index
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
   * Removes a map from the sequence at a specific index.
   *
   * @param {number} index - The index of the map to remove.
   * @returns {Promise<{ success: boolean, error?: string }>}
   * @throws {Error} If `index` is not a nonnegative integer.
   */
  async removeMapFromSequence(index) {
    if (!Number.isInteger(index) || index < 0) throw new Error(`Index must be a nonnegative integer, received: ${index}`);

    const requestMessage = new RequestMessage(this.client, "RemoveMapFromSequence", {
      Index: index
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
   * Moves a map within the sequence to a new index. **newIndex USES 1-BASED INDEXING**
   *
   * @param {number} currentIndex - The current index of the map.
   * @param {number} newIndex - The new index to move the map to.
   * @returns {Promise<{ success: boolean, error?: string }>}
   * @throws {Error} If `currentIndex` or `newIndex` is not a nonnegative integer.
   */
  async moveMapInSequence(currentIndex, newIndex) {
    if (!Number.isInteger(currentIndex) || currentIndex < 0) throw new Error(`currentIndex must be a nonnegative integer, received: ${currentIndex}`);
    if (!Number.isInteger(newIndex) || newIndex < 0) throw new Error(`newIndex must be a nonnegative integer, received: ${newIndex}`);

    const requestMessage = new RequestMessage(this.client, "MoveMapInSequence", {
      CurrentIndex: currentIndex,
      NewIndex: newIndex
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
   * Enables or disables map shuffling.
   *
   * @param {boolean} enable - Whether to enable or disable map shuffling.
   * @returns {Promise<{ success: boolean, error?: string }>}
   * @throws {Error} If `enable` is not a boolean.
   */
  async setMapShuffling(enable) {
    if (typeof enable !== "boolean") throw new Error(`Expected map shuffle to be a boolean, received: ${typeof enable}`);

    const requestMessage = new RequestMessage(this.client, "ShuffleMapSequence", {
      Enable: enable
    });

    const response = await this.client._send(requestMessage);

    if (response.statusCode === 200)
      return true;
    else
      throw new Error(`Error setting map shuffle: ${response.stringify()}`);
  }
}

module.exports = MapManager;