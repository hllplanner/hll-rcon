---
sidebar_position: 2
title: Manually Sending Commands
---

The `IRCONClient`, `RCONClientV2`, and `RCONClientV1` classes all implement their own manager-oriented APIs that cover
100% of the RCON APIs. If you dont want to use these and would prefer to write the commands yourself, that can be done
just as easily and without having to worry about managing the underlying protocol.

---

### Manually Sending RCONv1 Commands

To queue a message in RCONv1, use the following syntax:

```js
await RCONClientV2._send(message, options);
```

#### Parameters

| Name    | Description          | Type   | Required |
|---------|----------------------|--------|----------|
| message | The command to send. | string | True     |
| options | See below.           | Object | False    |

#### Options

| Name              | Description                                                                                                                | Type    | Default Value |
|-------------------|----------------------------------------------------------------------------------------------------------------------------|---------|---------------|
| encrypt           | The command to send.                                                                                                       | string  | True          |
| inactivityTimeout | How long in milliseconds to wait for a new packet to be received for <br/> the message sequence to be considered complete. | number  | 1_000         |
| shortResponse     | If the command returns `SUCCESS` or `FAIL`.                                                                                | boolean | False         |

:::note

For `shortResponse` to take effect, `RCONClientV1._expediteShortResponses` must be true, this value is set in the class'
constructor method.

`shortResponse` Was implemented to fix the problem of having to wait additional time for additional packets for commands
that will likely never return more than 1 packet of data. This was mostly added to make commands that return `SUCCESS`
or `FAIL` resolve much quicker. Theoretically, it can also be used for commands that return small packets of data such
as getting the server name or open slots, but the default behavior of this library only enables this feature on commands
that return `SUCCESS` or `FAIL`.

:::

#### Returns

`Promise<string>`

---

### Manually Sending RCONv2 Commands

To send messages in RCONv2, you must use the `RequestMessage` constructor, pass that to `RCONClientV2._send`, which
returns a `ResponseMessage`.

#### RequestMessage Constructor

```js
new RequestMessage(client, commandName, contentBody);
```

#### Parameters

| Name        | Description                   | Type             | Required |
|-------------|-------------------------------|------------------|----------|
| client      | The RCONv2 client.            | RCONClientV2     | True     |
| commandName | The command name.             | string           | True     |
| contentBody | The ContentBody if necessary. | object \| string | False    |

#### Sending the RequestMessage Object

```js
const response = await RCONClientV2._send(requestMessage);
```

#### Returns

`ResponseMessage`

#### ResponseMessage Object

```
{
  client: RCONClientV2,
  index: number,
  statusCode: number,
  statusMessage: string,
  version: number,
  name: string,
  contentBody: object | string
}
```

---

### Examples

Below are examples for `RCONClientV2` and `RCONClientV1` which both fetch all players in the server and then get
detailed information about each. `client` is assumed to be a logged in instance of the `IRCONClient` class.

:::tip

As you can see from the RCONv1 results, the `shortResponse` property can be very powerful, even nearly rivaling the
efficiency of the RCONv2 protocol. However, its important to use it only when you are sure the response will be short,
usually \<1000 bytes. In my experience testing this, the maximum incoming packet length is anywhere from 1460
to 14600, inconsistent in other words and therefore dangerous.

:::

---

### RCONv1 Without Expedition

```js
console.time("Duration");

const allPlayers = await client.v1.players.fetchPlayerIds();
for (const player of allPlayers) {
  const response = await client.v1._send(`PlayerInfo ${player.playerName}`);
  console.log(response);
}

console.log(`Traversed ${allPlayers.length} players.`);
console.timeEnd("Duration");
```

#### Output

```
...
Traversed 99 players.
Duration: 1:55.499 (m:ss.mmm)
```

---

### RCONv1 With Expedition

```js
console.time("Duration");

const allPlayers = await client.v1.players.fetchPlayerIds();
for (const player of allPlayers) {
  const response = await client.v1._send(`PlayerInfo ${player.playerName}`, { shortResponse: true });
  console.log(response);
}

console.log(`Traversed ${allPlayers.length} players.`);
console.timeEnd("Duration");
```

#### Output

```
...
Traversed 100 players.
Duration: 16.519s
```

---

### RCONv2

```js
console.time("Duration");

const allPlayers = await client.v2.players.fetch();

for (const player of allPlayers.players) {
  const requestMessage = new RequestMessage(client.v2, "ServerInformation", {
    Name: "player",
    Value: player.iD
  });

  const response = await client.v2._send(requestMessage);

  console.log(response);
}

console.log(`Traversed ${allPlayers.players.length} players.`);
console.timeEnd("Duration");
```

#### Output

```
...
Traversed 99 players.
Duration: 16.111s
```