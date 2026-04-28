> [!WARNING]
> This library is deprecated. See alternative [hll.js](https://github.com/hllplanner/hll.js).


<div align="center">
<img src="https://github.com/hllplanner/hll-ircon/blob/master/.github/resources/ircon-primary-logo-transparent-slim.png">
<div id="toc">
  <ul style="list-style: none">
    <summary>
      <h1>HLL RCON</h1>
    </summary>
  </ul>
</div>
<h3>A NodeJS library to interact with Hell Let Loose's RCONv2</h3>
</div>

---

## Installation

```bash
yarn add hll-rcon
...
npm i hll-rcon
```

## Getting Started

```js
const { RCONClient } = require("hll-rcon");

const client = new RCONClient({
  host: "123.123.123.123",
  port: "7799",
  password: "RCON_PASSWORD"
});

client.on("ready", async () => {
  const serverName = await client.server.getServerName();
  console.log(`Logged in to server: ${serverName}`);
});
```
