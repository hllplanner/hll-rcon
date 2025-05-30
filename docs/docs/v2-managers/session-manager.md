---
sidebar_position: 6
title: Session Manager
---

The session manager is used for managing anything relating to the active game, such as the map or sector layout.

---

### Get Session

```js
await RCONClientV2.session.getSession();
```

#### Returns

```
Promise<{
  success: boolean,
  error?: string,
  session?: {
    serverName: string,
    mapName: string,
    gameMode: string,
    playerCount: number,
    maxPlayerCount: number,
    queueCount: number,
    maxQueueCount: number,
    vIPQueueCount: number,
    maxVIPQueueCount: number
  }
}>
```

---

### Set Map

```js
await RCONClientV2.session.setMap(mapId);
```

#### Parameters

| Name  | Description | Type   | Required |
|-------|-------------|--------|----------|
| mapId | The map ID. | string | True     |

#### Returns

`Promise<{ success: boolean, error?: string }>`

---

### Set Sector Layout

:::note

Sectors are listed left-right or top-down depending on map orientation.

:::

```js
await RCONClientV2.session.setSectorLayout(sectors);
```

#### Example

```js
// The middle column of strongpoints for St Marie Du Mont
await RCONClientV2.session.setSectorLayout(["Le Grand Chemin", "Cattlesheds", "AA Network", "The Hamlet", "Hill 6"]);
```

#### Parameters

| Name   | Description               | Type            | Required |
|--------|---------------------------|-----------------|----------|
| layout | The names of the sectors. | `Array<string>` | True     |

#### Returns

`Promise<{ success: boolean, error?: string }>`

---

### Broadcast Message

:::note
This is the "Admin Message" in the top left corner of your screen. If a `message` variable is not provided, it will
clear the message.
:::

```js
await RCONClientV2.session.broadcastMessage(message);
```

#### Parameters

| Name    | Description            | Type   | Required |
|---------|------------------------|--------|----------|
| message | The message to display | string | False    |

#### Returns

`Promise<{ success: boolean, error?: string }>`