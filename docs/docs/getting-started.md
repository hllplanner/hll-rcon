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

That's it! Now you can start sending commands and building your client.

:::tip
If a method parameter is marked as required and an invalid input is given, a process error will be thrown. Please
validate any inputs before passing them to an API.
:::

## Issuing Commands

To issue RCON commands using the built-in manager structures, see [RCONClientV2](RCONClientV2.md).
Alternatively if you would like to write your own commands, see [how to send messages manually](./other/manually-sending-messages.md).