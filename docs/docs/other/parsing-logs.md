---
sidebar_position: 1
title: Parsing Logs
---

All logs returned from `RCONClientV1` and `RCONClientV2` both share the same structure, and are automatically parsed
into easily digestible JSON formats listed below.

:::note
Every log shares two common variables: `type` and `timestamp`. Because of this they will be omitted from the following
definitions. The header of each definition below is its `type` variable.
:::

---

### playerConnected

| Name       | Type   | Comment |
|------------|--------|---------|
| playerId   | String |         |
| playerName | String |         |

### playerDisconnected

| Name       | Type   | Comment |
|------------|--------|---------|
| playerId   | String |         |
| playerName | String |         |

### playerSwitchFaction

| Name       | Type   | Comment                     |
|------------|--------|-----------------------------|
| playerName | String |                             |
| oldFaction | String | `None`, `Axis`, or `Allies` |
| newFaction | String | `None`, `Axis`, or `Allies` |

### matchStart

| Name    | Type   | Comment |
|---------|--------|---------|
| mapName | String |         |

### matchEnded

| Name        | Type   | Comment |
|-------------|--------|---------|
| mapName     | String |         |
| alliesScore | Number |         |
| axisScore   | Number |         |

### voteStarted

| Name         | Type   | Comment                                        |
|--------------|--------|------------------------------------------------|
| voteId       | Number |                                                |
| voteType     | String | Can be `PVR_Kick_Abuse` or `PVR_Kick_Cheating` |
| executorName | String |                                                |
| targetName   | String |                                                |

### voteCast

| Name       | Type   | Comment                                           |
|------------|--------|---------------------------------------------------|
| voteId     | Number |                                                   |
| playerName | String |                                                   |
| action     | String | Can be `PV_Favour`, `PV_Ignored`, or `PV_Against` |

### voteExpiredBeforeCompletion

:::note
This is when a vote doesnt pass.
:::

| Name   | Type   | Comment |
|--------|--------|---------|
| voteId | Number |         |

### voteCompleted

:::note
This is when a vote passes.
:::

| Name   | Type   | Comment                                         |
|--------|--------|-------------------------------------------------|
| voteId | Number |                                                 |
| result | String | Can be `PVR_Passed` or `PVR_ExpiredOrCancelled` |

### votePrematurelyExpired

:::note
This seems to be a bug, when a vote kick is initiated and immediately drops. You may still be able to vote but it will
never actually kick the player.
:::

| Name   | Type   | Comment |
|--------|--------|---------|
| voteId | Number |         |

### votePassed

:::note
This is also when a vote passes, contains more detailed information
:::

| Name          | Type   | Comment |
|---------------|--------|---------|
| playerName    | String |         |
| forVotes      | Number |         |
| requiredVotes | Number |         |
| againstVotes  | Number |         |

### playerKilled

| Name          | Type   | Comment            |
|---------------|--------|--------------------|
| killerName    | String |                    |
| killerFaction | String | `Axis` or `Allies` |
| killerId      | String |                    |
| victimName    | String |                    |
| victimFaction | String | `Axis` or `Allies` |
| victimId      | String |                    |
| weapon        | String |                    |

### playerTeamKilled

| Name          | Type   | Comment            |
|---------------|--------|--------------------|
| killerName    | String |                    |
| killerFaction | String | `Axis` or `Allies` |
| killerId      | String |                    |
| victimName    | String |                    |
| victimFaction | String | `Axis` or `Allies` |
| victimId      | String |                    |
| weapon        | String |                    |

### playerKicked

| Name       | Type   | Comment |
|------------|--------|---------|
| playerName | String |         |
| reason     | String |         |

### playerBanned

:::note
To find the responsible admin ID, you will have to use data from a `PlayerManager`, `THE ADMINISTRATOR` is the actual
static value in the log, not a placeholder.
:::

| Name         | Type           | Comment                                                |
|--------------|----------------|--------------------------------------------------------|
| temporary    | Boolean        | True if the ban is temporary, otherwise is permanent.  |
| duration     | Number \| null | If the ban is temporary, the duration in hours.        |
| bannedBy     | String         | Either `VOTE` or `THE ADMINISTRATOR`.                  |
| playerName   | String         |                                                        |
| fullReason   | String         | The full reason shown to the user when they're kicked. |
| customReason | String \| null | The custom reason provided by an admin, if any.        |

### message

| Name       | Type   | Comment                            |
|------------|--------|------------------------------------|
| playerName | String |                                    |
| playerId   | String |                                    |
| message    | String | The message, newlines are escaped. |

### teamChat

| Name          | Type   | Comment                            |
|---------------|--------|------------------------------------|
| playerName    | String |                                    |
| playerId      | String |                                    |
| playerFaction | String | `Axis` or `Allies`                 |
| message       | String | The message, newlines are escaped. |

### unitChat

| Name          | Type   | Comment                            |
|---------------|--------|------------------------------------|
| playerName    | String |                                    |
| playerId      | String |                                    |
| playerFaction | String | `Axis` or `Allies`                 |
| message       | String | The message, newlines are escaped. |

### playerEnteredAdminCamera

| Name          | Type   | Comment                            |
|---------------|--------|------------------------------------|
| playerName    | String |                                    |
| playerId      | String |                                    |

### playerLeftAdminCamera

| Name          | Type   | Comment                            |
|---------------|--------|------------------------------------|
| playerName    | String |                                    |
| playerId      | String |                                    |