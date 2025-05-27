---
sidebar_position: 1
title: Admin Manager
---

The admin manager is used for managing the admin accounts of the server.

---

### List Admin Groups

```js
await RCONClientV1.admins.listAdminGroups();
```

#### Returns
`List<string>`

---

### List Admins

```js
await RCONClientV1.admins.list();
```

#### Returns
`Array<{ playerId: string, group: string, comment: string }>`

---

### Add Admin

```js
await RCONCLientV1.admins.add(playerId, group, comment);
```

#### Parameters

| Name     | Description                                                                         | Type   | Required |
|----------|-------------------------------------------------------------------------------------|--------|----------|
| playerId | The admin's player ID.                                                              | string | True     |
| group    | The group to add the admin to. Retrieved from [listAdminGroups](#list-admin-groups) | string | True     |
| comment  | The comment/nickname for the admin.                                                 | string | True     |

#### Returns

`Promise<"SUCCESS" | "FAIL">`

---

### Remove Admin

```js
await RCONCLientV1.admins.remove(playerId);
```

#### Parameters

| Name     | Description                                                                         | Type   | Required |
|----------|-------------------------------------------------------------------------------------|--------|----------|
| playerId | The admin's player ID.                                                              | string | True     |

#### Returns

`Promise<"SUCCESS" | "FAIL">`