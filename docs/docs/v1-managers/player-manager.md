---
sidebar_position: 4
title: Player Manager
---

The player manager is used for managing the active players on the server.

---

### Fetch Player Names

:::warning
This method shouldn't be used, use [fetchPlayerIds](#fetch-player-ids) instead, it returns not only the player names but
also player IDs.
:::

```js
await RCONClientV1.players.fetchPlayerNames();
```

#### Returns

`List<string>`

---

### Fetch Player IDs

```js
await RCONClientV1.players.fetchPlayerIds();
```

#### Returns

`Array<{ playerName: string, playerId: string }>`

---

### Get Player

:::warning
If the player is not found, this will return `null`.
:::

:::warning
If the player is not on a faction, the faction will be `None`.
:::

:::warning
If the player is not in a unit, `playerUnitId`, `playerUnitName`, and `playerLoadout` may be `undefined` or `null`.
:::

```js
await RCONClientV1.players.get(playerName);
```

#### Parameters

| Name       | Description        | Type   | Required |
|------------|--------------------|--------|----------|
| playerName | The player's name. | string | True     |

#### Returns

```
Promise<{
  playerName: string, 
  playerId: string, 
  playerFaction: string, 
  playerRole: string, 
  playerUnitId: string?,
  playerUnitName: string?, 
  playerLoadout: string?, 
  kills: number, 
  deaths: number, 
  combatScore: number, 
  offensiveScore: number, 
  defensiveScore: number, 
  supportScore: number
}>
```

or

`null`

---

### Message Player

```js
await RCONClientV1.players.message(playerId, message);
```

#### Parameters

| Name     | Description      | Type   | Required |
|----------|------------------|--------|----------|
| playerId | The player's ID. | string | True     |
| message  | The message.     | string | True     |

#### Returns

`Promise<"SUCCESS" | "FAIL">`

---

### Punish Player

```js
await RCONClientV1.players.punish(playerName, reason);
```

#### Parameters

| Name       | Description        | Type   | Required |
|------------|--------------------|--------|----------|
| playerName | The player's name. | string | True     |
| reason     | The reason.        | string | True     |

#### Returns

`Promise<"SUCCESS" | "FAIL">`

---

### Kick Player

```js
await RCONClientV1.players.kick(playerId, reason);
```

#### Parameters

| Name     | Description      | Type   | Required |
|----------|------------------|--------|----------|
| playerId | The player's ID. | string | True     |
| reason   | The reason.      | string | False    |

#### Returns

`Promise<"SUCCESS" | "FAIL">`

---

### Temporarily Ban Player

:::note
If you provide an `adminName`, you must also provide a `reason`. An error will be thrown if you dont.
:::

```js
await RCONClientV1.players.tempBan(playerId, duration, reason, adminName);
```

#### Parameters

| Name      | Description                                                                | Type   | Required |
|-----------|----------------------------------------------------------------------------|--------|----------|
| playerId  | The player's ID.                                                           | string | True     |
| duration  | The duration in hours, default to 2.                                       | number | False    |
| reason    | The reason.                                                                | string | False    |
| adminName | The admin's name. Retrieved from [listTemporaryBans](#list-temporary-bans) | string | False    |

#### Returns

`Promise<"SUCCESS" | "FAIL">`

---

### Remove Temporary Ban

```js
await RCONClientV1.players.removeTempBan(playerId);
```

#### Parameters

| Name     | Description      | Type   | Required |
|----------|------------------|--------|----------|
| playerId | The player's ID. | string | True     |

#### Returns

`Promise<"SUCCESS" | "FAIL">`

---

### List Temporary Bans

```js
await RCONClientV1.players.listTempBans();
```

#### Returns

`Promise<Array<{ identifier: string, nickname: string?, duration: number, bannedOn: Date, reason?: string, admin?: string }>>`

---

### Permanently Ban Player

:::note
If you provide an `adminName`, you must also provide a `reason`. An error will be thrown if you dont.
:::

```js
await RCONClientV1.players.permaBan(playerId, reason, adminName);
```

#### Parameters

| Name      | Description       | Type   | Required |
|-----------|-------------------|--------|----------|
| playerId  | The player's ID   | string | True     |
| reason    | The reason.       | string | False    |
| adminName | The admin's name. | string | False    |

#### Returns

`Promise<"SUCCESS" | "FAIL">`

---

### Remove Permanent Ban

```js
await RCONClientV1.players.removePermaBan(playerId);
```

#### Parameters

| Name     | Description      | Type   | Required |
|----------|------------------|--------|----------|
| playerId | The player's ID. | string | True     |

#### Returns

`Promise<"SUCCESS" | "FAIL">`

---

### List Permanent Bans

```js
await RCONClientV1.players.listPermaBans();
```

#### Returns

`Promise<Array<{ identifier: string, nickname: string?, bannedOn: Date, reason?: string, admin?: string }>>`

---

### Force Team Switch on Death

```js
await RCONClientV1.players.switchTeamOnDeath(playerName);
```

#### Parameters

| Name       | Description        | Type   | Required |
|------------|--------------------|--------|----------|
| playerName | The player's name. | string | True     |

#### Returns

`Promise<"SUCCESS" | "FAIL">`

---

### Force Immediate Team Switch

```js
await RCONClientV1.players.switchteamNow(playerName);
```

#### Parameters

| Name       | Description        | Type   | Required |
|------------|--------------------|--------|----------|
| playerName | The player's name. | string | True     |

#### Returns

`Promise<"SUCCESS" | "FAIL">`

---

### Add Player as VIP

```js
await RCONClientV1.players.addVIP(playerId, nickname);
```

#### Parameters

| Name     | Description                | Type   | Required |
|----------|----------------------------|--------|----------|
| playerId | The player's ID.           | string | True     |
| nickname | A nickname for the player. | string | True     |

#### Returns

`Promise<"SUCCESS" | "FAIL">`

---

### Remove Player as VIP

```js
await RCONClientV1.players.removeVIP(playerId);
```

#### Parameters

| Name     | Description                | Type   | Required |
|----------|----------------------------|--------|----------|
| playerId | The player's ID.           | string | True     |

#### Returns

`Promise<"SUCCESS" | "FAIL">`

---

### List VIPs

```js
await RCONClientV1.players.listVIPS();
```

#### Returns

`Promise<Array<{ playerId: string, nickname: string }>>`