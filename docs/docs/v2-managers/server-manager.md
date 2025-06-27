---
sidebar_position: 5
title: Server Manager
---

The server manager is used for manipulating and retrieving server configurations exposed through the RCON API.

---

### Set Team Switch Cooldown

:::danger

This command will always return a `400` error, even if it was successful.

:::

```js
await RCONClientV2.server.setTeamSwitchCooldown(cooldown);
```

#### Parameters

| Name     | Description              | Type   | Required |
|----------|--------------------------|--------|----------|
| cooldown | The cooldown in minutes. | number | True     |

#### Returns

`Promise<{ success: boolean, error?: string }>`

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

`Promise<{ success: boolean, error?: string }>`

---

### Get Max Queued Players

```js
await RCONClientV2.server.getMaxQueuedPlayers();
```

#### Returns

`Promise<{ success: boolean, error?: string, maxQueueCount?: number }>`

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

`Promise<{ success: boolean, error?: string }>`

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

`Promise<{ success: boolean, error?: string }>`

---

### Get Slots

```js
await RCONClientV2.server.getSlots();
```

#### Returns

`Promise<{ success: boolean, error?: string, current: number, maxiumum: number }>`

---

### Get Server Name

```js
await RCONClientV2.server.getServerName();
```

#### Returns

`Promise<{ success: boolean, error?: string, name?: string }>`

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

`Promise<{ success: boolean, error?: string>`

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

`Promise<{ success: boolean, error?: string>`

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

`Promise<{ success: boolean, error?: string }>`

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

`Promise<{ success: boolean, error?: string }>`

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

`Promise<{ success: boolean, error?: string }>`

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

`Promise<{ success: boolean, error?: string }>`

---

### Get Server Configuration

```js
await RCONClientV2.server.getConfiguration();
```

#### Returns

```ts
Promise<{
  success: boolean,
  error?: string,
  config?: {
    serverName: string,
    buildNumber: string,
    buildRevision: string,
    supportedPlatforms: Array<string>,
    passwordProtected: boolean
  }
}>
```

---

### List Profanities

```js
await RCONClientV2.server.listProfanities();
```

#### Returns

`Promise<{ success: boolean, error?: string, bannedWords?: Array<string> }>`

---

### Add Profanities

```js
await RCONClientV2.server.addProfanities(profanities);
```

#### Parameters

| Name        | Description                           | Type            | Required |
|-------------|---------------------------------------|-----------------|----------|
| profanities | The words or phrases you want to ban. | `Array<string>` | True     |

#### Returns

`Promise<{ success: boolean, error?: string }>`

---

### Remove Profanities

```js
await RCONClientV2.server.removeProfanities(profanities);
```

#### Parameters

| Name        | Description                             | Type            | Required |
|-------------|-----------------------------------------|-----------------|----------|
| profanities | The words or phrases you want to unban. | `Array<string>` | True     |

#### Returns

`Promise<{ success: boolean, error?: string }>`

---

### Set Match Timer Length

:::note
`gamemode` Is not case sensitive.
:::

:::info
Valid durations for gamemodes:<br></br>
Warfare: [30, 180]<br></br>
Offensive: [10, 60]<br></br>
Skirmish: [10, 60]<br></br>
:::

```js
await RCONClientV2.server.setMatchLength(gameMode, duration);
```

#### Parameters

| Name     | Description                                                                             | Type   | Required |
|----------|-----------------------------------------------------------------------------------------|--------|----------|
| gamemode | The gamemode to set the timer length for. Can be `Warfare`, `Offensive`, or `Skirmish`. | string | True     |
| duration | The time in minutes to set the duration for.                                            | number | True     |

#### Returns

`Promise<{ success: boolean, error?: string }>`

---

### Reset Match Timer Length

:::note
`gamemode` Is not case sensitive.
:::

```js
await RCONClientV2.server.resetMatchLength(gameMode);
```

#### Parameters

| Name     | Description                                                                             | Type   | Required |
|----------|-----------------------------------------------------------------------------------------|--------|----------|
| gamemode | The gamemode to set the timer length for. Can be `Warfare`, `Offensive`, or `Skirmish`. | string | True     |

#### Returns

`Promise<{ success: boolean, error?: string }>`

---

### Set Match Warmup Timer Length

:::note
`gamemode` Is not case sensitive.
:::

:::info
`duration` **Must** be between 1 and 10.
:::

```js
await RCONClientV2.server.setWarmupLength(gameMode, duration);
```

#### Parameters

| Name     | Description                                                                                    | Type   | Required |
|----------|------------------------------------------------------------------------------------------------|--------|----------|
| gamemode | The gamemode to set the warmup timer length for. Can be `Warfare`, `Offensive`, or `Skirmish`. | string | True     |
| duration | The time in minutes to set the duration for.                                                   | number | True     |

#### Returns

`Promise<{ success: boolean, error?: string }>`

---

### Reset Match Timer Length

:::note
`gamemode` Is not case sensitive.
:::

```js
await RCONClientV2.server.resetWarmupLength(gameMode);
```

#### Parameters

| Name     | Description                                                                                    | Type   | Required |
|----------|------------------------------------------------------------------------------------------------|--------|----------|
| gamemode | The gamemode to set the warmup timer length for. Can be `Warfare`, `Offensive`, or `Skirmish`. | string | True     |

#### Returns

`Promise<{ success: boolean, error?: string }>`