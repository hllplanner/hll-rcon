---
sidebar_position: 1
title: Server Manager
---

The server manager is used for manipulating and retrieving server configurations exposed through the RCON API.

---

### Set Team Switch Cooldown

```js
await RCONClientV1.server.setTeamSwitchCooldown(duration);
```

#### Parameters

| Name     | Description              | Type   | Required |
|----------|--------------------------|--------|----------|
| duration | The duration in minutes. | number | True     |

#### Returns

`Promise<"SUCCESS" | "FAIL">`

---

### Get Team Switch Cooldown

```js
await RCONClientV1.server.getTeamSwitchCooldown();
```

#### Returns

`Promise<number>`

---

### Set Max Queued Players

```js
await RCONClientV1.server.setMaxQueuedPlayers(count);
```

#### Parameters

| Name  | Description     | Type   | Required |
|-------|-----------------|--------|----------|
| count | The queue size. | number | True     |

#### Returns

`Promise<"SUCCESS" | "FAIL">`

---

### Get Max Queued Players

```js
await RCONClientV1.server.getMaxQueuedPlayers();
```

#### Returns

`Promise<number>`

---

### Set Idle Kick Cooldown

```js
await RCONClientV1.server.setIdleKickCooldown(duration);
```

#### Parameters

| Name     | Description                                               | Type   | Required |
|----------|-----------------------------------------------------------|--------|----------|
| duration | The time in minutes the player must be idle to be kicked. | number | True     |

#### Returns

`Promise<"SUCCESS" | "FAIL">`

---

### Get Idle Kick Cooldown

```js
await RCONClientV1.server.getIdleKickCooldown();
```

#### Returns

`Promise<number>`

---

### Set High Ping Threshold

```js
await RCONClientV1.server.setPingThreshold(threshold);
```

#### Parameters

| Name      | Description                                           | Type   | Required |
|-----------|-------------------------------------------------------|--------|----------|
| threshold | The ping in milliseconds that should not be exceeded. | number | True     |

#### Returns

`Promise<"SUCCESS" | "FAIL">`

---

### Get High Ping Threshold

```js
await RCONClientV1.server.getPingThreshold();
```

#### Returns

`Promise<number>`

---

### Get Current & Maximum Player Slots

```js
await RCONClientV1.server.getSlots();
```

#### Returns

`Promise<{ current: number, maximum: number }>`

---

### Set Welcome Message

```js
await RCONClientV1.server.say(message);
```

#### Parameters

| Name    | Description          | Type   | Required |
|---------|----------------------|--------|----------|
| message | The welcome message. | string | True     |

#### Returns

`Promise<"SUCCESS" | "FAIL">`

---

### Get Server Name

```js
await RCONClientV1.server.getServerName();
```

#### Returns

`Promise<string>`

---

### Set Autobalance Enabled

```js
await RCONClientV1.server.setAutoBalanceEnabled(enabled);
```

#### Parameters

| Name    | Description                               | Type    | Required |
|---------|-------------------------------------------|---------|----------|
| enabled | Whether or not to enable the autobalance. | boolean | True     |

#### Returns

`Promise<"SUCCESS" | "FAIL">`

---

### Get Autobalance Enabled

```js
await RCONClientV1.server.getAutoBalanceEnabled();
```

#### Returns

`Promise<boolean>`

---

### Set Autobalance Threshold

```js
await RCONClientV1.server.setAutoBalanceThreshold(threshold);
```

#### Parameters

| Name      | Description                                                           | Type   | Required |
|-----------|-----------------------------------------------------------------------|--------|----------|
| threshold | The maximum difference in players before an autobalance is triggered. | number | True     |

#### Returns

`Promise<"SUCCESS" | "FAIL">`

---

### Get Autobalance Threshold

```js
await RCONClientV1.server.getAutoBalanceThreshold();
```

#### Returns

`Promise<number>`

---

### Set Vote Kicks Enabled

```js
await RCONClientV1.server.setVoteKicksEnabled(enable);
```

#### Parameters

| Name   | Description                            | Type    | Required |
|--------|----------------------------------------|---------|----------|
| enable | Whether or not to enable vote kicking. | boolean | True     |

#### Returns

`Promise<"SUCCESS" | "FAIL">`

---

### Get Vote Kicking Enabled

```js
await RCONClientV1.server.getVoteKicksEnabled();
```

#### Returns

`Promise<boolean>`

---

### Set Vote Kick Thresholds

```js
await RCONClientV1.server.setVoteKickThresholds(thresholds);
```

#### Example

```js
// If there are 0-19 players in the server, vote kicks require 5 votes.
// If there are 20-49 players on the server, vote kicks require 10 votes.
// If there are 50+ players on the server, vote kicks require 25 votes.
await RCONClientV1.server.setVoteKickThresholds([[0, 5], [20, 10], [50, 25]]);
```

#### Parameters

| Name       | Description               | Type                   | Required |
|------------|---------------------------|------------------------|----------|
| thresholds | The vote kick thresholds. | `Array<Array<number>>` | True     |

#### Returns

`Promise<"SUCCESS" | "FAIL">`

---

### Get Vote Kick Thresholds

```js
await RCONClientV1.server.getVoteKickThresholds();
```

#### Example

```js
const response = await RCONClientV1.server.getVoteKickThresholds();
console.log(response); // [ [ 0, 5 ], [ 20, 10 ], [ 50, 25 ] ]
```

#### Returns

`Promise<Array<Array<string>>>`

---

### Reset Vote Kick Thresholds

:::warning

Using this command to manipulate vote kick thresholds is **not** recommended. It sets the threshold to an empty string
with a space, I am unable to verify what this actually reflects to on the server.
If you need to update the vote kick thresholds, use the before
mentioned [setVoteKickThresholds method](#set-vote-kick-thresholds).

:::

```js
await RCONClientV1.server.resetVoteKickThresholds();
```

#### Returns

`Promise<"SUCCESS" | "FAIL">`

---

### Set RCON Password

```js
await RCONClientV1.server.setRCONPassword(oldPassword, newPassword);
```

#### Parameters

| Name        | Description                    | Type   | Required |
|-------------|--------------------------------|--------|----------|
| oldPassword | The old/current RCON password. | string | True     |
| newPassword | The new RCON password..        | string | True     |

#### Returns

`Promise<"SUCCESS" | "FAIL">`

---

### Set VIP Slot Count

```js
await RCONClientV1.server.setVIPSlotCount(count);
```

#### Parameters

| Name  | Description                       | Type   | Required |
|-------|-----------------------------------|--------|----------|
| count | The amount of reserved VIP slots. | number | True     |

#### Returns

`Promise<"SUCCESS" | "FAIL">`

---

### Get VIP Slot Count

```js
await RCONClientV1.server.getVIPSlotCount();
```

#### Returns

`Promise<number>`

---

### List Profanities

```js
await RCONClientV1.server.listProfanities();
```

#### Returns

`Promise<string>`

---

### Add Profanities

```js
await RCONClientV1.server.addProfanities(profanities);
```

#### Parameters

| Name        | Description                           | Type            | Required |
|-------------|---------------------------------------|-----------------|----------|
| profanities | The words or phrases you want to ban. | `Array<string>` | True     |

#### Returns

`Promise<"SUCCESS" | "FAIL">`

---

### Remove Profanities

```js
await RCONClientV1.server.removeProfanities(profanities);
```

#### Parameters

| Name        | Description                             | Type            | Required |
|-------------|-----------------------------------------|-----------------|----------|
| profanities | The words or phrases you want to unban. | `Array<string>` | True     |

#### Returns

`Promise<"SUCCESS" | "FAIL">`

---