<div align="center">
<img src="https://github.com/hllplanner/hll-ircon/blob/master/.github/resources/ircon-primary-logo-transparent-slim.png">
<div id="toc">
  <ul style="list-style: none">
    <summary>
      <h1>HLL Integrated RCON</h1>
    </summary>
  </ul>
</div>
<h3>A NodeJS library to interact with Hell Let Loose's RCONv2</h3>
</div>

---

## Installation

```bash
yarn add hll-ircon
...
npm i hll-ircon
```

## Getting Started

```js
const { RCONClientV2 } = require("hll-ircon");

const client = new RCONClientV2({
  host: "127.0.0.1",
  port: "8000",
  password: "RCON_PASSWORD"
});

client.on("ready", async () => {
  const serverName = await client.server.getServerName();
  console.log(`Logged in to server: ${serverName}`);
});
```

## [Access The Full Documentation](https://ircon.hllplanner.net)