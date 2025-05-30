---
sidebar_position: 1
title: Admin Manager
---

The admin manager is used for configuring admins on the server.

---

### Add Admin

```js
await RCONClientV2.admins.add(playerId, group, comment);
```

#### Parameters

| Name     | Description                         | Type   | Required |
|----------|-------------------------------------|--------|----------|
| playerId | The admin's player ID.              | string | True     |
| group    | The group to add the admin to.      | string | True     |
| comment  | The comment/nickname for the admin. | string | False    |

#### Returns

`Promise<{ success: boolean, error?: string }>`

---

### Remove Admin

```js
await RCONClientV2.admins.remove(playerId);
```

#### Parameters

| Name     | Description                         | Type   | Required |
|----------|-------------------------------------|--------|----------|
| playerId | The admin's player ID.              | string | True     |

#### Returns

`Promise<{ success: boolean, error?: string }>`