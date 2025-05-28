---
sidebar_position: 5
title: Server Manager
---

The server manager is used for manipulating and retrieving server configurations exposed through the RCON API.

---

### Set Team Switch Cooldown

:::danger

This command seems to be broken in RCONv2, use the RCONv1 equivalent.

:::

```js
await RCONClientV2.server.setTeamSwitchCooldown(cooldown);
```

#### Parameters

| Name     | Description              | Type   | Required |
|----------|--------------------------|--------|----------|
| cooldown | The cooldown in minutes. | number | True     |

#### Returns

`Promise<boolean>`

---

### Set Max Queued Players

```js
await RCONClientV2.server.setMaxQueuedPlayers(count);
```

#### Parameters

| Name  | Description         | Type   | Required |
|-------|---------------------|--------|----------|
| count | The queue size. 1-6 | number | True     |

#### Returns

`Promise<boolean>`

---

### Get Max Queued Players

```js
await RCONClientV2.server.getMaxQueuedPlayers();
```

#### Returns

`Promise<number>`

---

### Set Idle Kick Cooldown

:::danger

This works until you try and disable the cooldown by providing 0. This is how its disabled in the RCONv1 api, but throws
a server error in RCONv2. Using the RCONv1 equivalent of this command is recommended.

:::

```js
await RCONClientV2.server.setIdleKickCooldown(cooldown);
```

#### Parameters

| Name     | Description   | Type   | Required |
|----------|---------------|--------|----------|
| cooldown | The cooldown. | number | True     |

#### Returns

`Promise<boolean>`

---

### Set High Ping Threshold

:::danger

This works until you try and disable the threshold by providing 0. This is how its disabled in the RCONv1 api, but
throws a server error in RCONv2. Using the RCONv1 equivalent of this command is recommended.

:::

```js
await RCONClientV2.server.setPingThreshold(time);
```

#### Parameters

| Name | Description     | Type   | Required |
|------|-----------------|--------|----------|
| time | The ping in MS. | number | True     |

#### Returns

`Promise<boolean>`

---

### Get Slots

```js
await RCONClientV2.server.getSlots();
```

#### Returns

`Promise<{ current: number, maximum: number }>`

---

### Get Server Name

```js
await RCONClientV2.server.getServerName();
```

#### Returns

`Promise<string>`

---

### Set Welcome Message

```js
await RCONClientV2.server.setWelcomeMessage(message);
```

#### Parameters

| Name    | Description         | Type   | Required |
|---------|---------------------|--------|----------|
| message | The message to set. | string | True     |

#### Returns

`Promise<boolean>`

---

### Set Auto Balancing Enabled

```js
await RCONClientV2.server.setAutoBalanceEnabled(enable);
```

#### Parameters

| Name   | Description                           | Type    | Required |
|--------|---------------------------------------|---------|----------|
| enable | Whether or not to enable the feature. | boolean | True     |

#### Returns

`Promise<boolean>`

---

### Set Auto Balancing Threshold

```js
await RCONClientV2.server.setAutoBalanceThreshold(difference);
```

#### Parameters

| Name       | Description                                                      | Type   | Required |
|------------|------------------------------------------------------------------|--------|----------|
| difference | The difference in player count for auto balancing to be invoked. | number | True     |

#### Returns

`Promise<boolean>`

---

### Set Vote Kicks Enabled

```js
await RCONClientV2.server.setVoteKicksEnabled(enable);
```

#### Parameters

| Name   | Description                          | Type    | Required |
|--------|--------------------------------------|---------|----------|
| enable | Whether or not to enable vote kicks. | boolean | True     |

#### Returns

`Promise<boolean>`

---

### Set Vote Kick Thresholds

```js
await RCONClientV2.server.setVoteKickThresholds(thresholds);
```

#### Example

```js
// If there are 0-19 players in the server, vote kicks require 5 votes.
// If there are 20-49 players on the server, vote kicks require 10 votes.
// If there are 50+ players on the server, vote kicks require 25 votes.
await RCONClientV2.server.setVoteKickThresholds([[0, 5], [20, 10], [50, 25]]);
```

#### Parameters

| Name       | Description               | Type                   | Required |
|------------|---------------------------|------------------------|----------|
| thresholds | The vote kick thresholds. | `Array<Array<number>>` | True     |

#### Returns

`Promise<boolean>`

---

### Reset Vote Kick Thresholds

:::warning

Using this command to manipulate vote kick thresholds is **not** recommended. It sets the threshold to an empty string
with a space, I am unable to verify what this actually reflects to on the server.
If you need to update the vote kick thresholds, use the before
mentioned [setVoteKickThresholds](#set-vote-kick-thresholds) method.

:::

```js
await RCONClientV2.server.resetVoteKickThresholds();
```

#### Returns

`Promise<boolean>`
