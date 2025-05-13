// Encrypt/Decrypt xor given a key. Expects input to be buffer.

function xor(inputBuffer, key) {
  const keyBuffer = Buffer.from(key, 'utf8');
  const outputBuffer = Buffer.alloc(inputBuffer.length);

  for (let i = 0; i < inputBuffer.length; i++) {
    outputBuffer[i] = inputBuffer[i] ^ keyBuffer[i % keyBuffer.length];
  }

  return outputBuffer;
}

module.exports = xor;