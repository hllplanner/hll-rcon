const net = require('net');
const EventEmitter = require('events');
const Message = require('./MessageV2');
const xor = require('../utils/XOR');

class RCONClientV1 extends EventEmitter {
  socket = new net.Socket();
  cipher = null;

  status = "READY";

  constructor({
    host,
    port,
    password
  }) {
    super();

    this.host = host;
    this.port = port;
    this.password = password;

    this.socket.on('data', (data) => {
      if (!this.cipher) {
        this.cipher = data;

        this.socket.write(xor(Buffer.from(`login ${this.password}`), this.cipher))

        return;
      }

      console.log(xor(data, this.cipher).toString());
    });

    this.socket.connect(this.port, this.host, async () => {
      this.status = "CONNECTED";
      console.log('Connected to v1')
    });
  }
}

module.exports = RCONClientV1;