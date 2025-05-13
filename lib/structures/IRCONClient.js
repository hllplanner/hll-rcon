const EventEmitter = require('events');
const RCONClientV1 = require('./RCONClientV1');
const RCONClientV2 = require('./RCONClientV2');

class IRCONClient extends EventEmitter {
  enableV1;
  v1Client;

  enableV2;
  v2Client;

  constructor({
    host,
    port,
    password,
    enableV1 = false,
    enableV2 = true
  } = {}) {
    super();

    if (!host || !port || !password) throw new Error('Missing one of: Host, port, password.');

    this.host = host;
    this.port = port;
    this.password = password;

    this.enableV1 = enableV1;
    this.enableV2 = enableV2;

    if (enableV1) {
      const client = new RCONClientV1({ host, port, password });

      client.on("ready", () => {
        if (!this.enableV2 || this.v2Client.status === "READY") this.emit("ready");
      })

      this.v1Client = client;
    }

    if (enableV2) {
      const client = new RCONClientV2({ host, port, password });

      client.on("ready", () => {
        if (!this.enableV1 || this.v1Client.status === "READY") this.emit("ready");
      })

      this.v2Client = client;
    }
  }

  sendV2(message) {
    return this.v2Client._send(message);
  }
}

module.exports = IRCONClient;