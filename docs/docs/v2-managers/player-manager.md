---
sidebar_position: 4
title: Player Manager
---

The player manager is used for managing the active players on the server.

---

### Player Object

```
{
  name: string,
  clanTag: string,
  iD: string,
  platform: string,
  eosId: string,
  level: number,
  team: number,
  role: number,
  platoon: string,
  loadout: string,
  kills: number,
  deaths: number,
  scoreData: {
    cOMBAT: number,
    offense: number,
    defense: number,
    support: number
  },
  worldPosition: {
    x: number,
    y: number,
    z: number
  }
}
```

---

### Fetch Players

```js
await RCONClientV2.players.fetch();
```

#### Returns

`Promise<{ success: boolean, error?: string, players?: Array<Player> }>`

---

### Get Player

```js
await RCONClientV2.players.get(playerId);
```

#### Parameters

| Name     | Description      | Type   | Required |
|----------|------------------|--------|----------|
| playerId | The player's ID. | string | True     |

#### Returns

`Promise<{ success: boolean, error?: string, player?: Player }>`

---

### Message Player

```js
await RCONClientV2.players.message(playerId, message);
```

#### Parameters

| Name     | Description      | Type   | Required |
|----------|------------------|--------|----------|
| playerId | The player's ID. | string | True     |
| message  | The message.     | string | True     |

#### Returns

`Promise<{ success: boolean, error?: string }>`

---

### Punish Player

```js
await RCONClientV2.players.punish(playerId, reason);
```

#### Parameters

| Name     | Description      | Type   | Required |
|----------|------------------|--------|----------|
| playerId | The player's ID. | string | True     |
| reason   | The reason.      | string | False    |

#### Returns

`Promise<{ success: boolean, error?: string }>`

---

### Kick Player

```js
await RCONClientV2.players.kick(playerId, reason);
```

#### Parameters

| Name     | Description      | Type   | Required |
|----------|------------------|--------|----------|
| playerId | The player's ID. | string | True     |
| reason   | The reason.      | string | False    |

#### Returns

`Promise<{ success: boolean, error?: string }>`

---

### Temporarily Ban Player

```js
await RCONClientV2.players.tempBan(playerId, duration, reason, adminName);
```

#### Parameters

| Name      | Description                          | Type   | Required |
|-----------|--------------------------------------|--------|----------|
| playerId  | The player's ID.                     | string | True     |
| duration  | The duration in hours, default to 2. | number | True     |
| reason    | The reason.                          | string | False    |
| adminName | The admin's name.                    | string | False    |

#### Returns

`Promise<{ success: boolean, error?: string }>`

---

### Remove Temporary Ban

```js
await RCONClientV2.players.removeTempBan(playerId);
```

#### Parameters

| Name     | Description      | Type   | Required |
|----------|------------------|--------|----------|
| playerId | The player's ID. | string | True     |

#### Returns

`Promise<{ success: boolean, error?: string }>`

---

### Permanently Ban Player

```js
await RCONClientV2.players.ban(playerId,reason, adminName);
```

#### Parameters

| Name      | Description                          | Type   | Required |
|-----------|--------------------------------------|--------|----------|
| playerId  | The player's ID.                     | string | True     |
| reason    | The reason.                          | string | False    |
| adminName | The admin's name.                    | string | False    |

#### Returns

`Promise<{ success: boolean, error?: string }>`

---

### Remove Permanent Ban

```js
await RCONClientV2.players.removeBan(playerId);
```

#### Parameters

| Name     | Description      | Type   | Required |
|----------|------------------|--------|----------|
| playerId | The player's ID. | string | True     |

#### Returns

`Promise<{ success: boolean, error?: string }>`

---

### Add Player as VIP

```js
await RCONClientV2.players.addVIP(playerId, nickname);
```

#### Parameters

| Name     | Description                | Type   | Required |
|----------|----------------------------|--------|----------|
| playerId | The player's ID.           | string | True     |
| nickname | A nickname for the player. | string | True     |

#### Returns

`Promise<{ success: boolean, error?: string }>`

---

### Remove Player as VIP

```js
await RCONClientV2.players.removeVIP(playerId);
```

#### Parameters

| Name     | Description                | Type   | Required |
|----------|----------------------------|--------|----------|
| playerId | The player's ID.           | string | True     |

#### Returns

`Promise<{ success: boolean, error?: string }>`