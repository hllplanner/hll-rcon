---
sidebar_position: 3
title: Map Manager
---

The map manager is used to manipulate map rotations and sequences.

---

### Add Map to Rotation

```js
await RCONClientV2.maps.addMapToRotation(mapId, index);
```

#### Parameters

| Name  | Description                                                | Type   | Required |
|-------|------------------------------------------------------------|--------|----------|
| mapId | The map ID.                                                | string | True     |
| index | The index to insert the new map at. Defaults to 0th index. | number | False    |

#### Returns

`Promise<{ success: boolean, error?: string }>`

---

### Remove Map from Rotation

```js
await RCONClientV2.maps.removeMapFromRotation(index);
```

#### Parameters

| Name  | Description                         | Type   | Required |
|-------|-------------------------------------|--------|----------|
| index | The index of the map to be removed. | number | True     |

#### Returns

`Promise<{ success: boolean, error?: string }>`

---

### Get the Map Sequence

```js
await RCONClientV2.maps.getMapSequence();
```

#### Returns

`Promise<{ success: boolean, error?: string, maps?: Array<string> }>`

---

### Add Map to Sequence

```js
await RCONClientV2.maps.addMapToSequence(mapId, index);
```

#### Parameters

| Name  | Description                         | Type   | Required |
|-------|-------------------------------------|--------|----------|
| mapId | The map ID.                         | string | True     |
| index | The index to insert the new map at. | number | True     |

#### Returns

`Promise<{ success: boolean, error?: string }>`

---

### Remove Map from Sequence

```js
await RCONClientV2.maps.removeMapFromSequence(index);
```

#### Parameters

| Name  | Description                     | Type   | Required |
|-------|---------------------------------|--------|----------|
| index | The index of the map to remove. | number | True     |

#### Returns

`Promise<{ success: boolean, error?: string }>`

---

### Move Map in Sequence

:::warning

`newIndex` Uses 1-based indexing.

:::

```js
await RCONClientV2.maps.moveMapInSequence(currentIndex, newIndex);
```

#### Parameters

| Name         | Description                       | Type   | Required |
|--------------|-----------------------------------|--------|----------|
| currentIndex | The index of the map to move.     | number | True     |
| currentIndex | The new index to move the map to. | number | True     |

#### Returns

`Promise<{ success: boolean, error?: string }>`

---

### Set Map Shuffling

```js
await RCONClientV2.maps.setMapShuffling(enable);
```

| Name   | Description                             | Type    | Required |
|--------|-----------------------------------------|---------|----------|
| enable | Whether or not to enable map shuffling. | boolean | True     |

#### Returns

`Promise<{ success: boolean, error?: string }>`

---

### Enable Dynamic Weather for Map

::: warning
Make sure the map you're trying to enable or disable dynamic weather for supports dynamic weather. This is not validated
by the library.
:::

```js
await RCONClientV2.maps.enableDynamicWeatherForMap(map, enable);
```

| Name   | Description                                           | Type    | Required |
|--------|-------------------------------------------------------|---------|----------|
| mapId  | The ID of the map to toggle dynamic weather for.      | string  | True     |
| enable | Whether or not to enable dynamic weather for the map. | boolean | True     |

#### Returns

`Promise<{ success: boolean, error?: string }>`