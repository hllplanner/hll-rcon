/**
 * List is a data type used by RCON v1.
 *
 * Via: https://gist.github.com/timraay/5634d85eab552b5dfafb9fd61273dc52#lists
 *   Some commands may return a list as response. Each value is separated by a tab (\t). The first entry in the list will dictate the length of the list (excluding itself), and the response always ends with an additional tab: 2\tITEM1\tITEM2\t
 *
 *   Caution
 *
 *   Some commands allow you to inject tabs into another command's response, which will cause programs attempting to unpack the list to fail. To prevent this from happening, you should replace any tabs before sending requests to the server.
 *
 *   An example of this is the vipadd command. When the name parameter here includes a tab, any subsequent get vipids commands will be programatically unreadable until the VIP is removed again using the vipdel command.
 *
 * @class
 * @extends Array
 *
 * @property {number} length - The indicated number of elements in the list.
 * @property {Array<any>} elements - Members of the list.
 * @property {string} raw - The raw server response that represents a list as a string.
 */
class List extends Array {
  elements;
  raw;

  constructor(data) {
    super();

    const segments = data.split("\t");

    this.raw = data;
    this.elements = segments.slice(1).filter(e => e !== "");
  }

  // Print as normal array
  [Symbol.for("nodejs.util.inspect.custom")](depth, options, inspect) {
    return inspect(this.elements, options);
  }
}

module.exports = List;