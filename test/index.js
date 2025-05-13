const RCONClient = require('../lib');
require('dotenv').config({
  path: `${__dirname}/../.env.local`
});

(async () => {
  const host = process.env.RCON_HOST;
  const port = process.env.RCON_PORT;
  const password = process.env.RCON_PASSWORD;

  const client = new RCONClient({ host, port, password });

  client.on('message', async (message) => {
    console.log(message)
  })
})();