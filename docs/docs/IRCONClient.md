---
sidebar_position: 2
title: IRCONClient
description: The IRCONClient
---

The `IRCONClient` is the primary client, exposing methods from both the `RCONClientV1` and `RCONClientV2` classes. When
executing a command, it will always favor the RCONv2 counterpart due to the protocol's enhanced speed and
reliability. If the command is not available for RCONv2, it will favor the RCONv1 counterpart, and vice versa.

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
