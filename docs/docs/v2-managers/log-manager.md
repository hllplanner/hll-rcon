---
sidebar_position: 2
title: Log Manager
---

The log manager is used for retrieving and storing server logs. You can read more on how to use logs [here](../other/parsing-logs).

---

### Fetch Logs

:::tip
The `filter` option really should not be used. All logs retrieved from the server are cached and can be used later,
adding this property means you are no longer caching logs that may be useful later on. Additionally, it provides no
speed improvement, and can just as easily be done on the client side.
:::

```js
await RCONClientV2.logs.fetch(backtrack, filter);
```

#### Parameters

| Name      | Description                                                                    | Type   | Required |
|-----------|--------------------------------------------------------------------------------|--------|----------|
| backtrack | The amount of seconds to backtrack in the logs.                                | number | True     |
| filter    | If provided, each log must include this string to be returned from the server. | string | False    |

#### Returns

`Promise<{ success: boolean, error: string?, logs?: Array<Log> }>`