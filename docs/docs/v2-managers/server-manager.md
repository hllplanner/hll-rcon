---
sidebar_position: 5
title: Server Manager
---

The server manager is used for manipulating and retrieving server configurations exposed through the RCON API.

---

### Set Team Switch Cooldown

:::danger
This command seems to be broken in RCONv2, use RCONv1 equivalent
:::

```js
await RCONClientV2.server.setTeamSwitchCooldown(cooldown);
```

#### Parameters

| Name     | Description              | Type   | Required |
|----------|--------------------------|--------|----------|
| cooldown | The cooldown in minutes. | number | True     |

#### Returns

`Promise<ResponseMessage>`

---

### Set Max Queued Players

```js
await RCONClientV2.server.setMaxQueuedPlayers(count);
```

#### Parameters

| Name  | Description          | Type   | Required |
|-------|----------------------|--------|----------|
| count | The queue size. 1-6  | number | True     |

#### Returns

`Promise<ResponseMessage>`

---