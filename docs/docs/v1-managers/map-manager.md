---
sidebar_position: 3
title: Map Manager
---

The map manager is used to manipulate map rotations and sequences.

---

### Get Available Maps

```js
await RCONClientV1.maps.getAllMaps();
```

#### Returns

`Promise<List<string>>`

---

### Get Maps in Rotation

```js
await RCONClientV1.maps.getMapsInRotation();
```

#### Returns

`Promise<Array<string>>`

---

### Add Map to Rotation

```js
await RCONClientV1.maps.addMapToRotation(mapId, afterMap, afterMapOrdinal);
```

#### Parameters

| Name            | Description                                      | Type   | Required |
|-----------------|--------------------------------------------------|--------|----------|
| mapId           | The map ID.                                      | string | True     |
| afterMap        | The ID of a map already in rotation.             | string | False    |
| afterMapOrdinal | The ordinal position of the specified after map. | string | False    |


#### Returns

`Promise<"SUCCESS" | "FAIL">`

---

### Remove Map from Rotation

```js
await RCONClientV1.maps.removeMapFromRotation(mapId, mapOrdinal);
```

#### Parameters

| Name       | Description                                              | Type   | Required |
|------------|----------------------------------------------------------|--------|----------|
| mapId      | The map ID.                                              | string | True     |
| mapOrdinal | The ordinal position of the specified map if applicable. | string | False    |


#### Returns

`Promise<"SUCCESS" | "FAIL">`

---

### Toggle Map Shuffling

```js
await RCONClientV1.maps.toggleMapShuffle();
```

#### Returns

`Promise<"SUCCESS" | "FAIL">`

---

### Check if Map Shuffling is Enabled

```js
await RCONClientV1.maps.getMapShufflingEnabled();
```

#### Returns

`Promise<boolean>`

---

### Get the Map Sequence

```js
await RCONClientV1.maps.getMapSequence();
```

#### Returns

`Promise<Array<string>>`