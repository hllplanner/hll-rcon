---
sidebar_position: 2
title: IRCONClient
description: The IRCONClient
---

The `IRCONClient` is the primary client, exposing both the `RCONClientV1` and `RCONClientV2` classes. You can access the
RCONv2 client through `IRCONClient.v2` and RCONv1 client through `IRCONClient.v1`.

### Constructor

```js
const { IRCONClient } = require("hll-ircon");

const client = new IRCONClient({
  host: "127.0.0.1",            // Server Host
  port: 8000,                   // RCON Port
  password: "RCON_PASSWORD",    // RCON Password

  v1InactivityTimeout: 1_000,   // Timeout to wait for the last message in RCONv1

  enableLogPolling: true,       // Enable log polling to enable "newLog" event
  pollSource: 2,                // From which RCON client version instance to poll logs from
  pollWindow: 30,               // How far to backtrack logs in seconds
  pollFrequency: 1,             // How frequently to poll new logs in milliseconds

  debug: false                  // Whether or not to enable debugging. Enter `true` to debug both RCONv1 
                                // and RCONv2, otherwise enter 1 or 2 to indicate which version to 
                                // enable logging for.
});
```
