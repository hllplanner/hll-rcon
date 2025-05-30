The `RCONClientV1` class is the client that is used for interacting with the RCONv1 API.

### Constructor

```js
const { RCONClientV1 } = require("hll-ircon");

const client = new RCONClientV1({
  host: "127.0.0.1",               // Server Host
  port: 8000,                      // RCON Port
  password: "RCON_PASSWORD",       // RCON Password
  debug: false,                    // Whether or not to enable debugging
  inactivityTimeout: 1_000,        // Default timeout to wait for packets before a message is considered finished
  expediteShortResponses: false    // Dont wait for multiple packets for short responses ("SUCCESS"|"FAIL")
});
```

### Managers

- [AdminManager](../v1-managers/admin-manager.md)
- [LogManager](../v1-managers/log-manager.md)
- [MapManager](../v1-managers/admin-manager.md)
- [PlayerManager](../v1-managers/player-manager.md)
- [ServerManager](../v1-managers/server-manager.md)
- [SessionManager](../v1-managers/session-manager.md)