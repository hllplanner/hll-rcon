---
sidebar_position: 6
title: Session Manager
---

The session manager is used for managing anything relating to the active game, such as the map or sector layout.

---

### Set Map

```js
await RCONClientV1.session.setMap(mapId, mapOrdinal);
```

#### Parameters

| Name       | Description                      | Type   | Required |
|------------|----------------------------------|--------|----------|
| mapId      | The map ID.                      | string | True     |
| mapOrdinal | The ordinal position of the map. | string | False    |

#### Returns

`Promise<"SUCCESS" | "FAIL">`

---

### Get Map

```js
await RCONClientV1.session.getMap();
```

#### Returns

`Promise<string>`

---

### Set Sector Layout

```js
await RCONClientV1.session.setSectorLayout(strongPoints);
```

#### Parameters

| Name         | Description                                               | Type            | Required |
|--------------|-----------------------------------------------------------|-----------------|----------|
| strongPoints | The strong point names, from left to right or up to down. | `Array<string>` | True     |

#### Returns

`Promise<"SUCCESS" | "FAIL">`

---

### Get Sector Layout

```js
await RCONClientV1.session.getSectorLayout(sector, inactivityTimeout);
```

#### Parameters

:::note
If a sector variable is *not* provided, this will attempt to fetch all strong points for each sector and combine them
into a 2d-array.
:::

:::note
This command isn't really necessary in most applications, sector names will not change without notification, and this
command takes a long time to complete. Instead, consider using hard coded strong point names.
:::

:::note
The `inactivityTimeout` variable is configurable here since if no strong point is provided it can take an excessive
amount of time to complete all requests. This variable is by default 200ms, which I have found is a good time to wait. I
dont recommend going lower unless your application has good ping to the game server. If you experience incomplete
results, increase this value.
:::

| Name              | Description                                              | Type   | Required |
|-------------------|----------------------------------------------------------|--------|----------|
| sector            | Which sector to get valid strong points for (0-4).       | number | False    |
| inactivityTimeout | The time to wait for last RCONv1 message to be received. | number | False    |

#### Returns

`Promise<Array<string> | Array<Array<string>>>`

---

### Broadcast Message

```js
await RCONClientV1.session.broadcastMessage(message);
```

#### Parameters

:::note
This is the "Admin Message" in the top left corner of your screen. If a `message` variable is not provided, it will
clear the message.
:::

| Name              | Description            | Type   | Required |
|-------------------|------------------------|--------|----------|
| message           | The message to display | string | False    |

#### Returns

`Promise<"SUCCESS" | "FAIL">`

---

### Get Game State

```js
await RCONClientV1.session.getGameState();
```

#### Returns

```
Promise<{
  alliedPlayers: number, 
  axisPlayers: number, 
  alliesScore: number, 
  axisScore: number, 
  remainingTime: string,
  map: string, 
  nextMap: string 
}>
```