---
sidebar_position: 1
title: Getting Started
description: Getting started with the hll-ircon package
hide_table_of_contents: true
---

# Getting Started

## Installation

```
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

client.on("ready", () => {
  console.log("Client ready!");
});
```

That's it! Now you can start sending commands and building your client.

:::tip
If a method parameter is marked as required, a process error will be thrown. Please validate inputs before passing them
to an API.
:::