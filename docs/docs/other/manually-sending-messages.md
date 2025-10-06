---
sidebar_position: 2
title: Manually Sending Commands
---

### Manually Sending RCONv2 Commands

To send messages in RCONv2, you can use the `RequestMessage` constructor and pass it to the `RCONClientV2._send` method
which will return a `ResponseMessage` object.

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