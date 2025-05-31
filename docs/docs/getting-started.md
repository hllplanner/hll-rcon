---
sidebar_position: 1
title: Getting Started
description: Getting started with the hll-ircon package
hide_table_of_contents: true
---

# Getting Started

## Installation

```bash
yarn add hll-ircon
...
npm i hll-ircon
```

## Instantiating the IRCONClient

```js title="index.js"
const { IRCONClient } = require("hll-ircon");

const client = new IRCONClient({
  host: "127.0.0.1",
  port: "8000",
  password: "RCON_PASSWORD"
});

client.on("ready", async () => {
  const serverName = await client.v2.server.getServerName();
  console.log(`Logged in to server: ${serverName}`);
});
```

That's it! Now you can start sending commands and building your client.

:::tip
If a method parameter is marked as required and an invalid input is given, a process error will be thrown. Please
validate any inputs before passing them to an API.
:::

## Issuing Commands

To issue RCON commands using the managers structure, see [RCONClientV1](./clients/RCONClientV1.md) and [RCONClientV2](./clients/RCONClientV2.md) to find their respective managers.
Alternatively if you would like to write your own commands, see [how to send messages manually](./other/manually-sending-messages.md).