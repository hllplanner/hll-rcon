---
sidebar_position: 2
title: RCONClientV2
hide_table_of_contents: true
---

The `RCONClientV2` class is the client that is used for interacting with the RCONv2 API.

### Constructor

```js
const { RCONClientV2 } = require("hll-ircon");

const client = new RCONClientV2({
  host: "127.0.0.1",               // Server Host
  port: 8000,                      // RCON Port
  password: "RCON_PASSWORD",       // RCON Password
  debug: false,                    // Whether or not to enable debugging
});
```

### Associated Managers

- [AdminManager](v2-managers/admin-manager.md)
- [LogManager](v2-managers/log-manager.md)
- [MapManager](v2-managers/admin-manager.md)
- [PlayerManager](v2-managers/player-manager.md)
- [ServerManager](v2-managers/server-manager.md)
- [SessionManager](v2-managers/session-manager.md)