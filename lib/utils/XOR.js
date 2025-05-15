/**
 * Encrypts or decrypts a given input buffer using XOR with a specified key.
 *
 * This function performs a bitwise XOR operation between each byte of the input buffer
 * and the corresponding byte of the key (repeated cyclically if the key is shorter than the input).
 *
 * @param {Buffer} inputBuffer - The input buffer to be encrypted or decrypted.
 * @param {string} key - The key used for the XOR operation. It is converted to a UTF-8 buffer.
 * @returns {Buffer} - A new buffer containing the result of the XOR operation.
 */
function xor(inputBuffer, key) {
  const keyBuffer = Buffer.from(key, 'utf8');
  const outputBuffer = Buffer.alloc(inputBuffer.length);

  for (let i = 0; i < inputBuffer.length; i++) {
    outputBuffer[i] = inputBuffer[i] ^ keyBuffer[i % keyBuffer.length];
  }

  return outputBuffer;
}

module.exports = xor;