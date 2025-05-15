/**
 * Wraps a given string in double quotes and escapes tab characters.
 *
 * @param {string} string - The input string to be wrapped in quotes.
 * @returns {string} The input string wrapped in double quotes with tabs escaped.
 */
const intoQuotes = (string) => {
  return `"${string.replace(/\t/g, "\\t")}"`;
};

module.exports = intoQuotes;