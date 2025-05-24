# Documentation of Hell Let Loose RCON

Forked from https://gist.github.com/timraay/5634d85eab552b5dfafb9fd61273dc52

Changes from fork:
- Kick accepts the player name, if it isnt found the server returns `FAIL`.
- For `PermaBan` and `TempBan` usernames that arent found now return `SUCCESS` and add whatever was given as an active ban.
- Fixed typo for `PardonPermaPan` -> `PardonPermaBan`
- `PardonPermaBan` and `PardonTempBan` also accept the banned user's id.
- When banning, the `BAN` log is created then `KICK` and `DISCONNECTED` logs are subsequently created. Additionally, none are created if the user is not in the server at the time the ban command is sent, even though the ban is still in effect.
- Temporary bans must be integers, rational numbers for <1 hour ban windows arent supported. If a rational number is entered it will default to the 2 hour duration.
- Fixed the markdown of most(all?) tables
- Ban logs can take several forms under the same `BAN` keyword depending on its type and if reason was given
- Add table of contents
- Add hll-ircon as example protocols
- Mention temp ban hour format for durations exceeding 999 hours
- Added vote logs
- Added teamswitch logs
- `Message` does not require quotes around the message.
- Other small changes

---

- [Protocol](#protocol)
- [Commands](#commands)
    + [Help](#help)
    + [Login](#login-password)
    + [RconPassword](#rconpassword-old_password-new_password)

    * [Server](#server)
        + [Get Name](#get-name)
        + [Get Slots](#get-slots)
        + [Get GameState](#get-gamestate)
        + [Get MaxQueuedPlayers](#get-maxqueuedplayers)
        + [Get NumVipSlots](#get-numvipslots)
        + [SetMaxQueuedPlayers](#setmaxqueuedplayers-size)
        + [SetNumVipSlots](#setnumvipslots-amount)
        + [Say](#say-message)
        + [Broadcast](#broadcast-message)
        + [ShowLog](#showlog-timespan-filter)
    * [Maps](#maps)
        + [Get Map](#get-map)
        + [Get MapsForRotation](#get-mapsforrotation)
        + [Get ObjectiveRow_n](#get-objectiverow_0get-objectiverow_1get-objectiverow_2get-objectiverow_3get-objectiverow_4)
        + [RotList](#rotlist)
        + [RotAdd](#rotadd-map_name-after_map_name-after_map_ordinal)
        + [RotDel](#rotdel-map_name-map_ordinal)
        + [Map](#map-map_name-map_ordinal)
        + [GameLayout](#gamelayout-obj0-obj1-obj2-obj3-obj4)
        + [QueryMapShuffle](#querymapshuffle)
        + [ToggleMapShuffle](#togglemapshuffle)
        + [ListCurrentMapSequence](#listcurrentmapsequence)
    * [Players](#players)
        + [Get Players](#get-players)
        + [Get PlayerIds](#get-playerids)
        + [Get AdminIds](#get-adminids)
        + [Get AdminGroups](#get-admingroups)
        + [Get VipIds](#get-vipids)
        + [PlayerInfo](#playerinfo-player_name)
        + [AdminAdd](#adminadd-player_id-role-name)
        + [AdminDel](#admindel-player_id)
        + [VipAdd](#vipadd-player_id-name)
        + [VipDel](#vipdel-player_id)
    * [Moderation](#moderation)
        + [Get TempBans](#get-tempbans)
        + [Get PermaBans](#get-permabans)
        + [Message](#message-player-message)
        + [Punish](#punish-player-reason)
        + [SwitchTeamOnDeath](#switchteamondeath-player)
        + [SwitchTeamNow](#switchteamnow-player)
        + [Kick](#kick-player-reason)
        + [TempBan](#tempban-player_id-duration-reason-admin_name)
        + [PermaBan](#permaban-player_id-reason-admin_name)
        + [PardonTempBan](#pardontempban-player_id)
        + [PardonPermaBan](#pardonpermaban-player_id)
    * [Configuration](#configuration)
        + [Get Idletime](#get-idletime)
        + [Get HighPing](#get-highping)
        + [Get TeamSwitchCooldown](#get-teamswitchcooldown)
        + [Get AutoBalanceEnabled](#get-autobalanceenabled)
        + [Get AutoBalanceThreshold](#get-autobalancethreshold)
        + [Get VoteKickEnabled](#get-votekickenabled)
        + [Get VoteKickThreshold](#get-votekickthreshold)
        + [Get Profanity](#get-profanity)
        + [SetKickIdleTime](#setkickidletime-threshold)
        + [SetHighPing](#sethighping-threshold)
        + [SetTeamSwitchCooldown](#setteamswitchcooldown-cooldown)
        + [SetAutoBalanceEnabled](#setautobalanceenabled-bool)
        + [SetAutoBalanceThreshold](#setautobalancethreshold-threshold)
        + [SetVoteKickEnabled](#setvotekickenabled-bool)
        + [SetVoteKickThreshold](#setvotekickthreshold-threshold_pairs)
        + [ResetVoteKickThreshold](#resetvotekickthreshold)
        + [BanProfanity](#banprofanity-profanities)
        + [UnbanProfanity](#unbanprofanity-profanities)
- [Logs](#logs)
- [Available Maps](#available-maps)
- [Available Weapons](#available-weapons)
    * [Firearms](#firearms)
    * [Deployables](#deployables)
    * [Vehicles (Roadkills)](#vehicles-roadkills)
    * [Vehicles (Armament)](#vehicles-armament)
    * [Commander Abilities](#commander-abilities)
    * [Removed Weapons](#removed-weapons)
    * [Bugged Weapon Names](#bugged-weapon-names)

# Protocol

HLL servers open up a RCON port that lets people connect via TCP. All communication is and should be encrypted with
a [XOR cipher](https://en.wikipedia.org/wiki/XOR_cipher), of which the key will be sent upon opening the socket
connection.

A few implementations can be found here:

- [rcon/connection.py](https://github.com/MarechJ/hll_rcon_tool/blob/master/rcon/connection.py)
  from [MarechJ/hll_rcon_tool](https://github.com/MarechJ/hll_rcon_tool) (Python 3, synchronous implementation using the
  `socket` stdlib)
- [lib/protocol.py](https://github.com/timraay/HLLLogUtilities/blob/main/lib/protocol.py)
  from [timraay/HLLLogUtilities](https://github.com/timraay/HLLLogUtilities) (Python 3, asynchronous implementation
  using the `asyncio` stdlib)
- [async_hll_rcon/connection.py](https://github.com/cemathey/async_hll_rcon/blob/main/async_hll_rcon/connection.py)
  from [cemathey/async_hll_rcon](https://github.com/cemathey/async_hll_rcon) (Python 3, asynchronous implementation
  using `trio`)
- [go-hll-rcon](https://github.com/floriansw/go-hll-rcon)
  from [FlorianSW/go-hll-rcon](https://github.com/floriansw/go-hll-rcon) (Golang)
- [go-let-loose](https://github.com/zMoooooritz/go-let-loose)
  from [zMoooooritz/go-let-loose](https://github.com/zMoooooritz/go-let-loose) (Golang)
- [lib/structures/v1/RCONClientV1.js](https://github.com/hllplanner/hll-ircon/blob/master/lib/structures/v1/RCONClientV1.js)
  from [hllplanner/hll-ircon](github.com/hllplanner/hll-ircon/tree/master) (NodeJS, RCONv1)
- [lib/structures/v2/RCONClientV2.js](https://github.com/hllplanner/hll-ircon/blob/master/lib/structures/v2/RCONClientV2.js)
  from [hllplanner/hll-ircon](github.com/hllplanner/hll-ircon/tree/master) (NodeJS, RCONv2)

## Executing commands

Commands are simply (encrypted) strings with no special headers and the like. All responses are either `SUCCESS`,
`FAIL`, `EMPTY`, or a custom string if the command should return information.

Commands may require one or more parameters. Parameters can be added behind the command itself, separated by a space. In
some instances parameters are allowed to be wrapped in "quotation marks", making it possible to include spaces.

To execute any commands (except for the [`help`](#help) command), the author needs to be authorized first. To do so, a [
`login`](#login-password) command has to be sent. If the response is not `SUCCESS`, the password is incorrect.
Attempting to run a command without proper authorization will yield a `FAIL`.

### Lists

Some commands may return a list as response. Each value is separated by a tab (`\t`). The first entry in the list will
dictate the length of the list (excluding itself), and the response always ends with an additional tab:
`2\tITEM1\tITEM2\t`

> [!CAUTION]
> Some commands allow you to inject tabs into another command's response, which will cause programs attempting to unpack
> the list to fail. To prevent this from happening, you should replace any tabs before sending requests to the server.
>
> An example of this is the [`vipadd`](#vipadd-player_id-name) command. When the `name` parameter here includes a tab,
> any subsequent [`get vipids`](#get-vipids) commands will be programatically unreadable until the VIP is removed again
> using the [`vipdel`](#vipdel-player_id) command.

### Built-in console

The game has a built-in RCON console which can be opened by pressing `Ctrl + Alt + Shift + N`. Depending on the admin
role you have, you may still need to [login](#login-password) to use certain commands.

### Unique player IDs

Each player has a persistent unique ID (UID) associated to them, which is the ideal identifier to target individual
players. A lot of commands do *not* accept UIDs however, and instead require the player's name. Carefully read the
documentation of each command to see whether you can use UIDs or not.

UIDs come in different formats, depending on the player's platform. For Steam players, it will be their Steam64ID. For
all other platforms it will be an MD5-hashed version 4 UUID.

> *Changed in U15.2: UUIDs are now hashed.*

# Commands

Legend:
> `<required>`

> `[optional]`

> `"may be quoted"`

Commands are case-insensitive.

> [!IMPORTANT]
> In case no response is documented, you may assume the command will return `SUCCESS`.

***

### `Help`

See all commands and their parameters.

> [!NOTE]
> You don't have to be logged in to use this command.

**Returns:**

- All available commands and parameters

***

### `Login <password>`

Authorizes this connection to use commands.

**Params:**

- **password** (str) - The server's RCON password

***

### `RconPassword <old_password> <new_password>`

Changes the RCON password.

**Params:**

- **old_password** (str) - The current RCON password
- **new_password** (str) - The new RCON password

***

## Server

***

### `Get Name`

Get the server's name, as can be seen in the server browser.

**Returns:**

- The server's name

***

### `Get Slots`

Get the current and max amount of players on the server.

**Returns:**

- The current and max player count, separated by a slash

```
> get slots
89/100
```

***

### `Get GameState`

Get information about the current match.

> [!WARNING]
> If the last player on a server leaves, the player count on their team is not updated to `0` and will stay `1` until a
> player joins the server.

**Returns:**

- Detailed information about the current match

```
> get gamestate
Players: Allied: 48 - Axis: 50
Score: Allied: 2 - Axis: 3
Remaining Time: 0:31:44
Map: utahbeach_warfare
Next Map: stmariedumont_warfare
```

***

### `Get MaxQueuedPlayers`

Get the max size of the server queue.

**Returns:**

- The max queue length

***

### `Get NumVipSlots`

Get the number of slots on the server that are reserved for VIPs.

**Returns:**

- The number of reserved slots

***

### `SetMaxQueuedPlayers <size>`

Changes the maximum size of the server queue.

**Params:**

- **size** (int) - The queue size (max. 6)

***

### `SetNumVipSlots <amount>`

Changes the amount of server slots reserved for VIPs.

**Params:**

- **amount** (int) - The number of reserved slots

***

### `Say <message>`

Generally known as the welcome message, shown on the deployment screen and when first spawning in.

Updates the welcome message, and shows the new message to every player currently spawned in.

**Params:**

- **message** (str) - The welcome messagae

***

### `Broadcast <message>`

Broadcasts a message at the top left of the screen for all players, or clears the current broadcast if the message is
empty.

> [!NOTE]
> The `message` parameter is still required, but it can be left completely empty. "`Broadcast`" would fail, while "
`Broadcast `" would clear the current message.

**Params:**

- **message** (str) - The broadcast message, leave empty to clear

***

### `ShowLog <timespan> ["filter"]`

Get [server logs](#logs) up to the specified amount of minutes ago.

> [!IMPORTANT]
> The server keeps track of all logs until it is restarted. You cannot obtain logs of actions that happened prior to a
> server restart.

**Params:**

- **timespan** (int) - The number of minutes ago that you want to include logs from. Setting this to, for instance, 5
  will return all logs from now up to 5 minutes ago.
- **filter** (str) - A phrase to filter all results by.

**Returns:**

- Log messages separated by newlines (`\n`), or `EMPTY` if no logs match the given criteria. For more information on how
  to break down the response see [the logs section](#logs).

***

## Maps

***

### `Get Map`

Get the current map. If the same map is played twice in a row, it will get a `_RESTART` suffix (eg.
`utahbeach_warfare_RESTART`).

While the server is loading a new map (which takes approx. 5 seconds), it may show a map called `Untitled_#`, with `#`
being the index of the map it is loading in rotation.

**Returns:**

- The active map

***

### `Get MapsForRotation`

Get a [list](#lists) of all existing maps. Not to be confused with the [rotlist](#rotlist) command, used to list all
maps currently in rotation.

**Returns:**

- A [list](#lists) of map names

***

### `Get ObjectiveRow_0`<br>`Get ObjectiveRow_1`<br>`Get ObjectiveRow_2`<br>`Get ObjectiveRow_3`<br>`Get ObjectiveRow_4`

Get a [list](#lists) of the 3 names of the objectives that can exist in the objective row. Objective rows always run
from left to right or top to bottom depending on the map orientation.

These are the objective names you can pass to the [GameLayout](#gamelayout-obj0-obj1-obj2-obj3-obj4) command.

> [!WARNING]
> This command will fail when the current gamemode is Skirmish and return the following response:
> `Cannot execute command for this gamemode.`

> [!NOTE]
> It is not possible to get a list of the five currently selected objectives.

> *Added in U15.2.*

**Returns:**

- A [list](#lists) of objective names

***

### `RotList`

Return the current map rotation of the server.

**Returns:**

- A `\n`-delimited sequence of map names

***

### `RotAdd <map_name> [after_map_name] [after_map_ordinal]`

Add a map to the rotation. This will be at the end, unless otherwise is specified.

> [!WARNING]
> This command will not always return `FAIL` on failure, but instead may return a message explaining why it failed.

> *Changed in U14.7:* `map_name` and `after_map_name` no longer need to be prefixed with `/Game/Maps/` and are now
> case-insensitive.

**Params:**

- **map_name** (str) - The map to add
- **after_map_name** (str) - The name of a map already in rotation the map should be placed next after.
- **after_map_ordinal** (int) - If `after_map_name` is in rotation more than once, after which instance of said map the
  new map should be added, by default `1` (1st)

***

### `RotDel <map_name> [map_ordinal]`

Remove a map from the rotation.

> [!WARNING]
> This command will not always return `FAIL` on failure, but instead may return a message explaining why it failed.

> *Changed in U14.7:* `map_name` no longer needs to be prefixed with `/Game/Maps/` and is now case-insensitive.

**Params:**

- **map_name** (str) - The map to remove
- **map_ordinal** (int) - If `map_name` is in rotation more than once, which instance of said map should be removed, by
  default `1` (1st)

***

### `Map <map_name> [map_ordinal]`

Starts a 60-second timer shown to all players on the server, after which the current match is immediately ended (
skipping the End of Round screen) and the specified map is laoded.

> *Changed in U14.7:* A map no longer needs to be in rotation to be switched to

**Params:**

- **map_name** (str) - The map to switch to, case-insensitive
- **map_ordinal** (int) - If `map_name` is in rotation more than once, which isntance of said map should be switched to,
  by default `1` (1st)

***

### `GameLayout <obj0> <obj1> <obj2> <obj3> <obj4>`

Restart the current match with the given objectives in play.

Objectives are from left-to-right or top-to-bottom depending on the map orientation and must be any of the objective
names returned
by [Get ObjectiveRow_0](#get-objectiverow_0get-objectiverow_1get-objectiverow_2get-objectiverow_3get-objectiverow_4)
to _4 respectively.

> [!NOTE]
> Objective names are case-insensitive.

> [!CAUTION]
> Due to a game bug, the server will crash if the objective names are invalid or if some but not all parameters are
> provided. Furthermore, the current map will remain poisoned and cause server crashes until the server itself is
> reinstalled.
>
> This is only present on Warfare on Offensive. On Skirmish, the match will simply restart regardless of the supplied
> parameters.
>
> **TODO:** Verify whether this bug still exists, as it might have been patched in the subsequent update.

> *Added in U15.2.*

**Params:**

- **obj0** (str) - The name of the 1st objective
- **obj1** (str) - The name of the 2nd objective
- **obj2** (str) - The name of the 3rd objective
- **obj3** (str) - The name of the 4th objective
- **obj4** (str) - The name of the 5th objective

***

### `QueryMapShuffle`

Query whether map shuffling is enabled.

> *Added in U14.*

**Returns:**

- `Map Shuffle: TRUE` or `Map Shuffle: FALSE`

***

### `ToggleMapShuffle`

Toggle map shuffling on or off.

> [!WARNING]
> This command can supposedly fail under certain unknown circimstances.

> *Added in U14.*

***

### `ListCurrentMapSequence`

Assuming map shuffling has been enabled, returns the new, shuffled rotation

> *Added in U14.*

**Returns:**

- A `\n`-delimited sequence of map names

***

## Players

***

### `Get Players`

Get a [list](#lists) of the names of all online players.

**Returns:**

- A [list](#lists) of player names

***

### `Get PlayerIds`

Get a [list](#lists) of names and UIDs of all online players.

**Returns:**

- A [list](#lists) of player names and UIDs:

```
> get playerids
2\t(WTH) Abu : 76561199023367826\tAnotherName : 12345678901234567\t
```

***

### `Get AdminIds`

Get a [list](#lists) of all admins, which includes their name, UID, and their role.

A list of available roles can be obtained using the [`get admingroups`](#get-admingroups) command.

**Returns:**

- A [list](#lists) of all admins. Each item in the list is a string containing a UID, a role, and a name, all separated
  by a space:

```
> get adminids
2\t76561199023367826 senior (WTH) Abu\t12345678901234567 camera AnotherName\t
```

***

### `Get AdminGroups`

Get a [list](#lists) of available permission groups or "roles", that can be assigned using the [
`adminadd`](#adminadd-player_id-role-name) command.

Groups and their individual permissions can often be configured on the panel provided by Game Server Providers.

**Returns:**

- A [list](#lists) of roles

***

### `Get VipIds`

Get a [list](#lists) of all VIPs, which includes a UID and a comment (usually their name).

**Returns:**

- A [list](#lists) of all VIPs. Each item in the list is a string containing a UID and a comment, all separated by a
  space:

```
> get vipids
2\t76561199023367826 Abu (Admin)\t12345678901234567 AnotherName\t
```

***

### `PlayerInfo <player_name>`

Return detailed information about a player, including their team and unit, role, and kills.

> [!NOTE]
> The `PlayerInfo` command is the only command that shows the full name of the player. All other commands will truncate
> names longer than 20 characters.

> [!IMPORTANT]
> The amount of information included may vary depending on the state of the player.
> - If the player is on the team select screen, their team will be `None` and their current loadout is not included.
> - If the player is not in a unit or is commander, no information related to their unit will be included.

> [!WARNING]
> The player's loadout is only updated every time they spawn in.

> [!CAUTION]
> If a player's name has a space as 20th character, its truncated name will end with a space, which will cause this
> command to always fail. It is not possible to get detailed information about this player.

**Params:**

- **player_name** (str) - The name of a player

**Returns:**

- Detailed information about a player

```
> playerinfo (WTH) Abu
Name: (WTH) Abu
steamID64: 12345678901234567
Team: Allies
Role: Officer
Unit: 0 - Able
Loadout: NCO
Kills: 0 - Deaths: 0
Score: C 50, O 0, D 40, S 10
Level: 174
```

***

### `AdminAdd <"player_id"> <"role"> ["name"]`

Assign an admin role to a user, granting them access to special permissions in-game.

**Params:**

- **player_id** (str) - The UID of a player
- **role** (str) - An assignable [role](#get-admingroups)
- **name** (str) - A name for the player

***

### `AdminDel <player_id>`

Remove any roles from a user, revoking their access to special permissions in-game.

**Params:**

- **player_id** (str) - The UID of a player

***

### `VipAdd <"player_id"> <"name">`

Assign VIP permissions to a user, allowing them to use reserved VIP slots.

> [!WARNING]
> The `"name"` parameter must be quoted to include spaces.

> [!CAUTION]
> If `"player_id"` is an empty string, it cannot be removed.

**Params:**

- **player_id** (str) - The UID of a player
- **name** (str) - A name for the player

***

### `VipDel <player_id>`

Remove VIP permissions from a user, revoking their ability to use reserved VIP slots.

**Params:**

- **player_id** (str) - The UID of a player

***

## Moderation

***

### `Get TempBans`

Get a [list](#lists) of all active temporary bans.

Each returned ban is a string (or so-called "ban log") that you have to parse yourself. It will include the UID, name at
the time of ban, duration in hours, date banned, reason, and admin name:

```
76561199023367826 : nickname "(WTH) Abu" banned for 2 hours on 2021.12.09-16.40.08 for "Being a troll" by admin "Some Admin Name"
```

Both the reason and admin name are omitted if they were not provided when the player was banned.

> [!NOTE]
> It is **strongly** discouraged to use a player name in favor of a player ID to apply a temporary ban. If the player is
> not in the server at the time of the ban, the name will be returned from `Get TempBans`, however the ban will not
> actually take effect.

> [!NOTE]
> The player's nickname will only be returned from this if they were in the server at the time they were banned.

> [!NOTE]
> You may see some empty strings included in the array. These are expired bans that due to a game bug still affect the
> response.

**Returns:**

- A [list](#lists) of bans.

***

### `Get PermaBans`

Get a [list](#lists) of all active permanent bans.

> [!NOTE]
> The player's nickname will only be returned from this if they were in the server at the time they were banned.

Each returned ban is a string (or so-called "ban log") that you have to parse yourself. It will include the UID, name at
the time of ban, date banned, reason, and admin name:

```
76561199023367826 : nickname "(WTH) Abu" banned on 2021.12.09-16.40.08 for "Being a troll" by admin "Some Admin Name"
```

You need the full, raw ban log to [remove a perma ban](#pardonpermaban-ban-log).

**Returns:**

- A [list](#lists) of bans.

***

### `Message <"player"> <message>`

Message a player with a specific message shown to them at the top right of their screen.

> [!WARNING]
> Due to a game bug, using a name that contains one or more spaces to target a player will always fail. Use a UID
> instead to reliably target a player.

**Params:**

- **player** (str) - The name or UID of a player
- **message** (str) - The message shown to the player

***

### `Punish <"player"> ["reason"]`

Kill a player with a specific message shown to them.

**Params:**

- **player** (str) - The name of a player
- **reason** (str) - The reason shown to the player

***

### `SwitchTeamOnDeath <player>`

Make a player switch teams next time they die.

**Params:**

- **player** (str) - The name of a player

***

### `SwitchTeamNow <player>`

Make a player switch teams immediately, killing them if they are alive.

**Params:**

- **player** (str) - The name of a player

***

### `Kick <"player"> ["reason"]`

Kick a player from the server with a specific message shown to them.

> [!NOTE]
> The `<"player_id">` parameter technically also supports player names however this is unrecommended. If the name
*isn't* found the server *will* return `FAIL`.

**Params:**

- **player_id** (str) - The UID or name of the player
- **reason** (str) - The reason shown to the player

***

### `TempBan <"player_id"> [duration] ["reason"] ["admin_name"]`

Temporarily ban a player for the duration and reason specified.

> [!NOTE]
> The `<"player_id">` parameter technically also supports player names although this is bad practice and not
> recommended. The game server will take it at face value and not check if the username or UID is valid, adding whatever
> input is given as a temporary ban, and returning `SUCCESS`.

**Params:**

- **player_id** (str) - The UID of a player
- **duration** (int) - The duration of the ban in hours, defaults to 2. **Must** be integer, **cant** be rational
  number.
- **reason** (str) - The reason shown to the player
- **admin_name** (str) - The name of whoever applied the ban, for audit purposes only

***

### `PermaBan <"player_id"> ["reason"] ["admin_name"]`

> [!NOTE]
> The `<"player_id">` parameter technically also supports player names although this is bad practice and not
> recommended. The game server will take it at face value and not check if the username or UID is valid, adding whatever
> input is given as a permanent ban, and returning `SUCCESS`.

> [!NOTE]
> Unless the player is in the server at the time of the ban, if a nickname is used in favor of an id, the ban will be
> added, however will not take effect.

**Params:**

- **player_id** (str) - The UID of a player
- **reason** (str) - The reason shown to the player
- **admin_name** (str) - The name of whoever applied the ban, for audit purposes only

***

### `PardonTempBan <player_id>`

Remove a temporary ban.

**Params:**

- **player_id** (str) - The banned player's UID

> [!NOTE]
> The ban log retrieved from [`get tempbans`](#get-tempbans) may be used in place of the banned player's UID, however
> this is unnecessary and unrecommended in most instances.

***

### `PardonPermaBan <player_id>`

Remove a permanent ban.

**Params:**

- **player_id** (str) - The banned player's UID

> [!NOTE]
> The ban log retrieved from [`get permabans`](#get-permabans) may be used in place of the banned player's UID, however
> this is unnecessary and unrecommended in most instances.

***

## Configuration

***

### `Get Idletime`

Get the current amount of minutes of inactivity before a player is automatically kicked.

**Returns:**

- The number of minutes players can be idle for

***

### `Get HighPing`

Get the current latency ("ping") threshold that will trigger an automated kick when surpassed.

**Returns:**

- The latency threshold in milliseconds

***

### `Get TeamSwitchCooldown`

Get the current team switch cooldown in minutes.

**Returns:**

- The team switch cooldown

***

### `Get AutoBalanceEnabled`

Get whether team auto balance is enabled or not.

**Returns:**

- `0` or `1`

***

### `Get AutoBalanceThreshold`

Get the current auto balance player threshold.

**Returns:**

- The auto balance threshold

***

### `Get VoteKickEnabled`

Get whether players can initiate vote kicks or not.

**Returns:**

- `0` or `1`

***

### `Get VoteKickThreshold`

Get the current vote kick threshold. When the number of votes reaches this threshold the player is kicked.

**Returns:**

- The number of votes required

***

### `Get Profanity`

Get a [list](#lists) of all profanities (censored words in chat) on the server.

**Returns:**

- A [list](#lists) of all profanities

***

### `SetKickIdleTime <threshold>`

Changes the time it takes for inactive players to be automatically kicked.

**Params:**

- **threshold** (int) - The threshold in minutes, 0 to disable

***

### `SetHighPing <threshold>`

Changes the latency threshold players have to not exceed in order to not be automatically kicked.

**Params:**

- **threshold** (int) - The threshold in milliseconds, 0 to disable

***

### `SetTeamSwitchCooldown <cooldown>`

Changes the cooldown applied before being able to switch teams again.

**Params:**

- **cooldown** (int) - The cooldown in minutes

***

### `SetAutoBalanceEnabled <bool>`

Enable or disable team auto balancing.

**Params:**

- **bool** (bool) - Whether auto balance should be enabled, either `on` or `off`.

***

### `SetAutoBalanceThreshold <threshold>`

Changes the maximum difference in players per team before players are forced to join the lesser full team.

**Params:**

- **threshold** (int) - The threshold

***

### `SetVoteKickEnabled <bool>`

Enable or disable vote kicking.

**Params:**

- **bool** (bool) - Whether vote kicks should be enabled, either `on` or `off`.

***

### `SetVoteKickThreshold <threshold_pairs>`

Set the amount of votes required to kick a player. The amount can be varied depending on the amount of players online at
the moment.

**Params:**

- **threshold_pairs** (str) - Expects a comma-separated list of playercount & threshold pairs. The first pair must
  always be for 0 players. You can add as many pairs as you want. For instance, `0,5,25,10` will require 5 votes when at
  least 0 players are online, or otherwise 10 votes when at least 25 players are online.

***

### `ResetVoteKickThreshold`

Reset the vote kick thresholds defined with the [`setvotekickthreshold`](#setvotekickthreshold-threshold-pairs) command.

***

### `BanProfanity <profanities>`

Add one or more words to the list of profanities.

**Params:**

- **profanities** (str) - A comma-separated list of words

**Returns:**

- A [list](#lists) of all profanities

***

### `UnbanProfanity <profanities>`

Remove one or more words from the list of profanities.

**Params:**

- **profanities** (str) - A comma-separated list of words

**Returns:**

- A [list](#lists) of all profanities

***

# Logs

Logs can be obtained with the [`Showlog`](#showlog-timespan-filter) command. Logs are returned as a wall of text, oldest
first, with each line representing an event that happened on the game server.

Each line is prefixed with how long ago the event took place, as well as the timestamp.

```r
[10:00:00 hours (1639106251)] CONNECTED A Player Name (12345678901234567)
[10:00:00 hours (1639122640)] DISCONNECTED A Player Name (12345678901234567)
[10:00:00 hours (1639143555)] KILL: A Player Name(Axis/12345678901234567) -> (WTH) A Player name(Allies/12345678901234567) with MP40
[10:00:00 hours (1639144073)] TEAM KILL: A Player Name(Allies/12345678901234567) -> A Player Name(Allies/12345678901234567) with M1 GARAND
[30:00 min (1639144118)] CHAT[Team][A Player Name(Allies/12345678901234567)]: Please build garrisons!
[30:00 min (1639145775)] CHAT[Unit][A Player Name(Axis/12345678901234567)]: comms working?
[15.03 sec (1639148961)] Player [A Player Name (12345678901234567)] Entered Admin Camera
[15.03 sec (1639148961)] Player [A Player Name (12345678901234567)] Left Admin Camera
[15.03 sec (1639148961)] TEAMSWITCH A Player Name (None > Allies)
[15.03 sec (1639148961)] TEAMSWITCH A Player Name (Allies > Axis)
[15.03 sec (1639148961)] BAN: [A Player Name] has been banned. [BANNED FOR 2 HOURS BY THE ADMINISTRATOR!]
[15.03 sec (1639148961)] KICK: [A Player Name] has been kicked. [BANNED FOR 2 HOURS BY THE ADMINISTRATOR!]
[15.03 sec (1639148961)] MESSAGE: player [A Player Name(12345678901234567)], content [Stop teamkilling, you donkey!]
[805 ms (1639148969)] MATCH START SAINTE-MÈRE-ÉGLISE Warfare
[805 ms (1639148969)] MATCH ENDED `SAINTE-MÈRE-ÉGLISE Warfare` ALLIED (2 - 3) AXIS 
[10:00:00 hours (1639144073)] VOTESYS: Player [A Player Name] Started a vote of type (PVR_Kick_Abuse) against [A Player Name]. VoteID: [1]
[10:00:00 hours (1639144073)] VOTESYS: Player [A Player Name] Started a vote of type (PVR_Kick_Cheating) against [A Player Name]. VoteID: [2]
[10:00:00 hours (1639144073)] VOTESYS: Player [A Player Name] voted [PV_Favour] for VoteID[1]
[10:00:00 hours (1639144073)] VOTESYS: Player [A Player Name] voted [PV_Against] for VoteID[1]
[10:00:00 hours (1639144073)] VOTESYS: Player [A Player Name] voted [PV_Ignored] for VoteID[1]
[10:00:00 hours (1639144073)] VOTESYS: Vote [1] completed. Result: PVR_Passed
[10:00:00 hours (1639144073)] VOTESYS: Vote Kick {A Player Name} successfully passed. [For: Votes_Cast_In_Favor/Required_Votes - Against: Votes_Cast_Not_In_Favor]
# Assuming not enough votes were cast.
[10:00:00 hours (1639144073)] VOTESYS: Vote [2] expired before completion.
[10:00:00 hours (1639144073)] VOTESYS: Vote [2] completed. Result: PVR_ExpiredOrCancelled
# This seems to be associated with a server bug, however has occurred before and should be handled
[10:00:00 hours (1639144073)] VOTESYS: Vote [3] prematurely expired.
```

> [!WARNING]
> Certain log lines may include unescaped newlines, turning them into multiple lines. As of writing, this can happen
> with `BAN`, `KICK` and `MESSAGE` log lines.
> ```
> [13:35 min (1671206494)] MESSAGE: player [A Player Name(12345678901234567)], content [This is line 1.
> This is line 2.
> And this is line 3!]
> ```
> You can escape these newlines with Regex. The below example uses a negative lookahead to replace any newlines not
> followed by the log time you see at the start of each line with an escaped newline.
> ```py
> # Python
> import re
> logs = logs.strip('\n')
> logs = re.sub(r"\n(?!\[.+? \(\d+\)\])", "\\n", logs)
> ```

> [!IMPORTANT]
> Ban logs can take several forms, depending on if its temporary or permanent, and if a reason was given.<br/><br/>
> A permanent ban will take the following log structure:
> ```r
> [10.00 sec (1747621803)] BAN: [A Player Name] has been banned. [PERMANENTLY BANNED BY THE ADMINISTRATOR!]
> ```
> If a reason was given it will take the following structure:
> ```r
> [10.00 sec (1747625337)] BAN: [A Player Name] has been banned. [PERMANENTLY BANNED BY THE ADMINISTRATOR!
> 
> example reason]
> ```
>
> The `Kick` command works in a similar manner:
>
> Without a reason:
> ```r
> [10.0 sec (1747625667)] KICK: [A Player Name] has been kicked. [KICKED BY THE ADMINISTRATOR!]
> ```
>
> With a reason:
> ```r
> [10.0 sec (1747625530)] KICK: [A Player Name] has been kicked. [KICKED BY THE ADMINISTRATOR!
> 
> example reason]
> ```

> [!NOTE]
> When a player is banned, a `BAN` log entry will be created, followed by a `KICK` log, and finally a `DISCONNECTED`
> log. The `BAN` and `KICK` logs will have the same message.

> [!NOTE]
> If a `PermaBan` or `TempBan` command is issued, and the user is not in the server at that time, it will ***not*** be
> logged. The ban will still be in effect.

> [!NOTE]
> If the hour duration of a temporary ban exceeds 999, the server will format the log with a comma:
> ```r
> [6.14 sec (1747629271)] BAN: [A Player Name] has been banned. [BANNED FOR 1,234 HOURS BY THE ADMINISTRATOR!]
> [6.14 sec (1747629271)] KICK: [A Player Name] has been kicked. [BANNED FOR 1,234 HOURS BY THE ADMINISTRATOR!]
> ```

# Available Maps

| <sub>Map Name                              | <sub>Query Name             | <sub>Pretty Name*                 | <sub>Base              | <sub>Gamemode  | <sub>Environment | <sub>Attackers |
|--------------------------------------------|-----------------------------|-----------------------------------|------------------------|----------------|------------------|----------------|
| <sub>`CAR_S_1944_Day_P_Skirmish`           | <sub>`DEV_F_DAY_SKM`        | <sub>CARENTAN Skirmish            | <sub>Carentan          | <sub>Skirmish  | <sub>Day         | <sub>          |
| <sub>`CAR_S_1944_Dusk_P_Skirmish`          | <sub>`DEV_F_DUSK_SKM`       | <sub>CARENTAN Skirmish            | <sub>Carentan          | <sub>Skirmish  | <sub>Dusk        | <sub>          |
| <sub>`CAR_S_1944_Rain_P_Skirmish`          | <sub>`DEV_F_RAIN_SKM`       | <sub>CARENTAN Skirmish            | <sub>Carentan          | <sub>Skirmish  | <sub>Rain        | <sub>          |
| <sub>`carentan_offensive_ger`              | <sub>`CT`                   | <sub>CARENTAN Offensive           | <sub>Carentan          | <sub>Offensive | <sub>Day         | <sub>GER       |
| <sub>`carentan_offensive_us`               | <sub>`CT`                   | <sub>CARENTAN Offensive           | <sub>Carentan          | <sub>Offensive | <sub>Day         | <sub>US        |
| <sub>`carentan_warfare`                    | <sub>`CT`                   | <sub>CARENTAN Warfare             | <sub>Carentan          | <sub>Warfare   | <sub>Day         | <sub>          |
| <sub>`carentan_warfare_night`              | <sub>`CT_N`                 | <sub>CARENTAN NIGHT Warfare       | <sub>Carentan          | <sub>Warfare   | <sub>Night       | <sub>          |
| <sub>`driel_offensive_ger`                 | <sub>`Driel_Day`            | <sub>DRIEL Offensive              | <sub>Driel             | <sub>Offensive | <sub>Day         | <sub>GER       |
| <sub>`driel_offensive_us`                  | <sub>`Driel_Day`            | <sub>DRIEL Offensive              | <sub>Driel             | <sub>Offensive | <sub>Day         | <sub>GB        |
| <sub>`driel_warfare`                       | <sub>`Driel`                | <sub>DRIEL Warfare                | <sub>Driel             | <sub>Warfare   | <sub>Dawn        | <sub>          |
| <sub>`driel_warfare_night`                 | <sub>`Driel_N`              | <sub>DRIEL Warfare                | <sub>Driel             | <sub>Warfare   | <sub>Night       | <sub>          |
| <sub>`DRL_S_1944_P_Skirmish`               | <sub>`DEV_C_SKM`            | <sub>DRIEL Skirmish               | <sub>Driel             | <sub>Skirmish  | <sub>Dawn        | <sub>          |
| <sub>`DRL_S_1944_Day_P_Skirmish`           | <sub>`DEV_C_Day_SKM`        | <sub>DRIEL Skirmish               | <sub>Driel             | <sub>Skirmish  | <sub>Day         | <sub>          |
| <sub>`DRL_S_1944_Night_P_Skirmish`         | <sub>`DEV_C_Night_SKM`      | <sub>DRIEL Skirmish               | <sub>Driel             | <sub>Skirmish  | <sub>Night       | <sub>          |
| <sub>`ELA_S_1942_P_Skirmish`               | <sub>`DEV_D_Day_SKM`        | <sub>EL ALAMEIN Skirmish          | <sub>El Alamein        | <sub>Skirmish  | <sub>Day         | <sub>          |
| <sub>`ELA_S_1942_Night_P_Skirmish`         | <sub>`DEV_D_Night_SKM`      | <sub>EL ALAMEIN Skirmish          | <sub>El Alamein        | <sub>Skirmish  | <sub>Dusk        | <sub>          |
| <sub>`elalamein_offensive_CW`              | <sub>`elalamein`            | <sub>EL ALAMEIN Offensive         | <sub>El Alamein        | <sub>Offensive | <sub>Day         | <sub>B8A       |
| <sub>`elalamein_offensive_ger`             | <sub>`elalamein`            | <sub>EL ALAMEIN Offensive         | <sub>El Alamein        | <sub>Offensive | <sub>Day         | <sub>DAK       |
| <sub>`elalamein_warfare`                   | <sub>`elalamein`            | <sub>EL ALAMEIN Warfare           | <sub>El Alamein        | <sub>Warfare   | <sub>Day         | <sub>          |
| <sub>`elalamein_warfare_night`             | <sub>`elalamein_N`          | <sub>EL ALAMEIN Warfare           | <sub>El Alamein        | <sub>Warfare   | <sub>Dusk        | <sub>          |
| <sub>`elsenbornridge_offensiveger_day`     | <sub>`DEV_N`                | <sub>ELSENBORN RIDGE Offensive    | <sub>Elsenborn Ridge   | <sub>Offensive | <sub>Day         | <sub>GER       |
| <sub>`elsenbornridge_offensiveger_morning` | <sub>`DEV_N_Morning`        | <sub>ELSENBORN RIDGE Offensive    | <sub>Elsenborn Ridge   | <sub>Offensive | <sub>Dawn        | <sub>GER       |
| <sub>`elsenbornridge_offensiveger_night`   | <sub>`DEV_N_Night`          | <sub>ELSENBORN RIDGE Offensive    | <sub>Elsenborn Ridge   | <sub>Offensive | <sub>Night       | <sub>GER       |
| <sub>`elsenbornridge_offensiveUS_day`      | <sub>`DEV_N`                | <sub>ELSENBORN RIDGE Offensive    | <sub>Elsenborn Ridge   | <sub>Offensive | <sub>Day         | <sub>US        |
| <sub>`elsenbornridge_offensiveUS_morning`  | <sub>`DEV_N_Morning`        | <sub>ELSENBORN RIDGE Offensive    | <sub>Elsenborn Ridge   | <sub>Offensive | <sub>Dawn        | <sub>US        |
| <sub>`elsenbornridge_offensiveUS_night`    | <sub>`DEV_N_Night`          | <sub>ELSENBORN RIDGE Offensive    | <sub>Elsenborn Ridge   | <sub>Offensive | <sub>Night       | <sub>US        |
| <sub>`elsenbornridge_skirmish_day`         | <sub>`DEV_N_Day_SKM`        | <sub>ELSENBORN RIDGE Skirmish     | <sub>Elsenborn Ridge   | <sub>Skirmish  | <sub>Day         | <sub>          |
| <sub>`elsenbornridge_skirmish_morning`     | <sub>`DEV_N_Morning_SKM`    | <sub>ELSENBORN RIDGE Skirmish     | <sub>Elsenborn Ridge   | <sub>Skirmish  | <sub>Dawn        | <sub>          |
| <sub>`elsenbornridge_skirmish_night`       | <sub>`DEV_N_Night_SKM`      | <sub>ELSENBORN RIDGE Skirmish     | <sub>Elsenborn Ridge   | <sub>Skirmish  | <sub>Night       | <sub>          |
| <sub>`elsenbornridge_warfare_day`          | <sub>`DEV_N`                | <sub>ELSENBORN RIDGE Warfare      | <sub>Elsenborn Ridge   | <sub>Warfare   | <sub>Day         | <sub>          |
| <sub>`elsenbornridge_warfare_morning`      | <sub>`DEV_N_Morning`        | <sub>ELSENBORN RIDGE Warfare      | <sub>Elsenborn Ridge   | <sub>Warfare   | <sub>Dawn        | <sub>          |
| <sub>`elsenbornridge_warfare_night`        | <sub>`DEV_N_Night`          | <sub>ELSENBORN RIDGE Warfare      | <sub>Elsenborn Ridge   | <sub>Warfare   | <sub>Night       | <sub>          |
| <sub>`foy_offensive_ger`                   | <sub>`Foy`                  | <sub>FOY Offensive                | <sub>Foy               | <sub>Offensive | <sub>Day         | <sub>GER       |
| <sub>`foy_offensive_us`                    | <sub>`Foy`                  | <sub>FOY Offensive                | <sub>Foy               | <sub>Offensive | <sub>Day         | <sub>US        |
| <sub>`foy_warfare`                         | <sub>`Foy`                  | <sub>FOY Warfare                  | <sub>Foy               | <sub>Warfare   | <sub>Day         | <sub>          |
| <sub>`foy_warfare_night`                   | <sub>`Foy_N`                | <sub>FOY Warfare                  | <sub>Foy               | <sub>Warfare   | <sub>Night       | <sub>          |
| <sub>`HIL_S_1944_Day_P_Skirmish`           | <sub>`DEV_H_Day_Skirmish`   | <sub>HILL 400 Skirmish            | <sub>Hill 400          | <sub>Skirmish  | <sub>Day         | <sub>          |
| <sub>`HIL_S_1944_Dusk_P_Skirmish`          | <sub>`DEV_H_Dusk_Skirmish`  | <sub>HILL 400 Skirmish            | <sub>Hill 400          | <sub>Skirmish  | <sub>Dusk        | <sub>          |
| <sub>`hill400_offensive_ger`               | <sub>`Hill400`              | <sub>HILL 400 Offensive           | <sub>Hill 400          | <sub>Offensive | <sub>Foggy       | <sub>GER       |
| <sub>`hill400_offensive_US`**              | <sub>`Hill400`              | <sub>HILL 400 Offensive           | <sub>Hill 400          | <sub>Offensive | <sub>Day         | <sub>US        |
| <sub>`hill400_warfare`                     | <sub>`Hill400`              | <sub>HILL 400 Warfare             | <sub>Hill 400          | <sub>Warfare   | <sub>Day         | <sub>          |
| <sub>`hill400_warfare_night`***            |                             |                                   |                        |                |                  |                |
| <sub>`Hill400_N`                           | <sub>HILL 400 Warfare       | <sub>Hill 400                     | <sub>Warfare           | <sub>Night     | <sub>            |                |
| <sub>`hurtgenforest_offensive_ger`         | <sub>`Hurtgen`              | <sub>HÜRTGEN FOREST Offensive     | <sub>Hürtgen Forest    | <sub>Offensive | <sub>Foggy       | <sub>GER       |
| <sub>`hurtgenforest_offensive_US`          | <sub>`Hurtgen`              | <sub>HÜRTGEN FOREST Offensive     | <sub>Hürtgen Forest    | <sub>Offensive | <sub>Day         | <sub>US        |
| <sub>`hurtgenforest_warfare_V2`            | <sub>`Hurtgen`              | <sub>HÜRTGEN FOREST Warfare       | <sub>Hürtgen Forest    | <sub>Warfare   | <sub>Day         | <sub>          |
| <sub>`hurtgenforest_warfare_V2_night`      | <sub>`Hurtgen_N`            | <sub>HÜRTGEN FOREST Warfare       | <sub>Hürtgen Forest    | <sub>Warfare   | <sub>Night       | <sub>          |
| <sub>`kharkov_offensive_ger`               | <sub>`Kharkov`              | <sub>Kharkov Offensive            | <sub>Kharkov           | <sub>Offensive | <sub>Day         | <sub>GER       |
| <sub>`kharkov_offensive_rus`               | <sub>`Kharkov`              | <sub>Kharkov Offensive            | <sub>Kharkov           | <sub>Offensive | <sub>Day         | <sub>RUS       |
| <sub>`kharkov_warfare`                     | <sub>`Kharkov`              | <sub>Kharkov Warfare              | <sub>Kharkov           | <sub>Warfare   | <sub>Day         | <sub>          |
| <sub>`kharkov_warfare_night`               | <sub>`Kharkov_N`            | <sub>Kharkov Warfare              | <sub>Kharkov           | <sub>Warfare   | <sub>Night       | <sub>          |
| <sub>`kursk_offensive_ger`                 | <sub>`Kursk`                | <sub>KURSK Offensive              | <sub>Kursk             | <sub>Offensive | <sub>Day         | <sub>GER       |
| <sub>`kursk_offensive_rus`                 | <sub>`Kursk`                | <sub>KURSK Offensive              | <sub>Kursk             | <sub>Offensive | <sub>Day         | <sub>RUS       |
| <sub>`kursk_warfare`                       | <sub>`Kursk`                | <sub>KURSK Warfare                | <sub>Kursk             | <sub>Warfare   | <sub>Day         | <sub>          |
| <sub>`kursk_warfare_night`                 | <sub>`Kursk_N`              | <sub>KURSK Warfare                | <sub>Kursk             | <sub>Warfare   | <sub>Night       | <sub>          |
| <sub>`mortain_offensiveger_day`            | <sub>`Mortain`              | <sub>MORTAIN Offensive            | <sub>Mortain           | <sub>Offensive | <sub>Day         | <sub>GER       |
| <sub>`mortain_offensiveger_dusk`           | <sub>`Mortain_E`            | <sub>MORTAIN Offensive            | <sub>Mortain           | <sub>Offensive | <sub>Dawn        | <sub>GER       |
| <sub>`mortain_offensiveger_overcast`       | <sub>`Mortain_O`            | <sub>MORTAIN Offensive            | <sub>Mortain           | <sub>Offensive | <sub>Overcast    | <sub>GER       |
| <sub>`mortain_offensiveUS_day`**           | <sub>`Mortain`              | <sub>MORTAIN Offensive            | <sub>Mortain           | <sub>Offensive | <sub>Day         | <sub>US        |
| <sub>`mortain_offensiveUS_dusk`            | <sub>`Mortain_E`            | <sub>MORTAIN Offensive            | <sub>Mortain           | <sub>Offensive | <sub>Dawn        | <sub>US        |
| <sub>`mortain_offensiveUS_overcast`**      | <sub>`Mortain_O`            | <sub>MORTAIN Offensive            | <sub>Mortain           | <sub>Offensive | <sub>Overcast    | <sub>US        |
| <sub>`mortain_skirmish_day`                | <sub>`Mortain_SKM_Day`      | <sub>MORTAIN Skirmish             | <sub>Mortain           | <sub>Skirmish  | <sub>Day         | <sub>          |
| <sub>`mortain_skirmish_dusk`               | <sub>`Mortain_SKM_Evening`  | <sub>MORTAIN Skirmish             | <sub>Mortain           | <sub>Skirmish  | <sub>Dawn        | <sub>          |
| <sub>`mortain_skirmish_overcast`           | <sub>`Mortain_SKM_Overcast` | <sub>MORTAIN Skirmish             | <sub>Mortain           | <sub>Skirmish  | <sub>Overcast    | <sub>          |
| <sub>`mortain_warfare_day`                 | <sub>`Mortain`              | <sub>MORTAIN Warfare              | <sub>Mortain           | <sub>Warfare   | <sub>Day         | <sub>          |
| <sub>`mortain_warfare_dusk`                | <sub>`Mortain_E`            | <sub>MORTAIN Warfare              | <sub>Mortain           | <sub>Warfare   | <sub>Dawn        | <sub>          |
| <sub>`mortain_warfare_overcast`            | <sub>`Mortain_O`            | <sub>MORTAIN Warfare              | <sub>Mortain           | <sub>Warfare   | <sub>Overcast    | <sub>          |
| <sub>`omahabeach_offensive_ger`            | <sub>`Omaha`                | <sub>OMAHA BEACH Offensive        | <sub>Omaha Beach       | <sub>Offensive | <sub>Day         | <sub>GER       |
| <sub>`omahabeach_offensive_us`             | <sub>`Omaha`                | <sub>OMAHA BEACH Offensive        | <sub>Omaha Beach       | <sub>Offensive | <sub>Day         | <sub>US        |
| <sub>`omahabeach_warfare`                  | <sub>`Omaha`                | <sub>OMAHA BEACH Warfare          | <sub>Omaha Beach       | <sub>Warfare   | <sub>Day         | <sub>          |
| <sub>`omahabeach_warfare_night`            | <sub>`Omaha_N`              | <sub>OMAHA BEACH Warfare          | <sub>Omaha Beach       | <sub>Warfare   | <sub>Dusk        | <sub>          |
| <sub>`PHL_L_1944_OffensiveGER`             | <sub>`PHL`                  | <sub>PURPLE HEART LANE Offensive  | <sub>Purple Heart Lane | <sub>Offensive | <sub>Day         | <sub>GER       |
| <sub>`PHL_L_1944_OffensiveUS`              | <sub>`PHL`                  | <sub>PURPLE HEART LANE Offensive  | <sub>Purple Heart Lane | <sub>Offensive | <sub>Day         | <sub>US        |
| <sub>`PHL_L_1944_Warfare`                  | <sub>`PHL`                  | <sub>PURPLE HEART LANE Warfare    | <sub>Purple Heart Lane | <sub>Warfare   | <sub>Rain        | <sub>          |
| <sub>`PHL_L_1944_Warfare_Night`            | <sub>`PHL_N`                | <sub>PURPLE HEART LANE Warfare    | <sub>Purple Heart Lane | <sub>Warfare   | <sub>Night       | <sub>          |
| <sub>`PHL_S_1944_Rain_P_Skirmish`          | <sub>`DEV_K_Rain_SKM`       | <sub>PURPLE HEART LANE Skirmish   | <sub>Purple Heart Lane | <sub>Skirmish  | <sub>Rain        | <sub>          |
| <sub>`PHL_S_1944_Morning_P_Skirmish`       | <sub>`DEV_K_Morning_SKM`    | <sub>PURPLE HEART LANE Skirmish   | <sub>Purple Heart Lane | <sub>Skirmish  | <sub>Morning     | <sub>          |
| <sub>`PHL_S_1944_Night_P_Skirmish`         | <sub>`DEV_K_Night_SKM`      | <sub>PURPLE HEART LANE Skirmish   | <sub>Purple Heart Lane | <sub>Skirmish  | <sub>Night       | <sub>          |
| <sub>`remagen_offensive_ger`               | <sub>`Remagen`              | <sub>REMAGEN Offensive            | <sub>Remagen           | <sub>Offensive | <sub>Foggy       | <sub>GER       |
| <sub>`remagen_offensive_us`                | <sub>`Remagen`              | <sub>REMAGEN Offensive            | <sub>Remagen           | <sub>Offensive | <sub>Day         | <sub>US        |
| <sub>`remagen_warfare`                     | <sub>`Remagen`              | <sub>REMAGEN Warfare              | <sub>Remagen           | <sub>Warfare   | <sub>Day         | <sub>          |
| <sub>`remagen_warfare_night`               | <sub>`Remagen_N`            | <sub>REMAGEN Warfare              | <sub>Remagen           | <sub>Warfare   | <sub>Night       | <sub>          |
| <sub>`SMDM_S_1944_Day_P_Skirmish`          | <sub>`DEV_M_SKM`            | <sub>ST MARIE DU MONT Skirmish    | <sub>St. Marie Du Mont | <sub>Skirmish  | <sub>Day         | <sub>          |
| <sub>`SMDM_S_1944_Rain_P_Skirmish`         | <sub>`DEV_M_Rain_SKM`       | <sub>ST MARIE DU MONT Skirmish    | <sub>St. Marie Du Mont | <sub>Skirmish  | <sub>Rain        | <sub>          |
| <sub>`SMDM_S_1944_Night_P_Skirmish`        | <sub>`DEV_M_Night_SKM`      | <sub>ST MARIE DU MONT Skirmish    | <sub>St. Marie Du Mont | <sub>Skirmish  | <sub>Night       | <sub>          |
| <sub>`SME_S_1944_Day_P_Skirmish`           | <sub>`DEV_I_DAY_SKM`        | <sub>SAINTE-MÈRE-ÉGLISE Skirmish  | <sub>St. Mere Eglise   | <sub>Warfare   | <sub>Day         | <sub>          |
| <sub>`SME_S_1944_Morning_P_Skirmish`       | <sub>`DEV_I_MORNING_SKM`    | <sub>SAINTE-MÈRE-ÉGLISE Skirmish  | <sub>St. Mere Eglise   | <sub>Warfare   | <sub>Dawn        | <sub>          |
| <sub>`SME_S_1944_Night_P_Skirmish`         | <sub>`DEV_I_NIGHT_SKM`      | <sub>SAINTE-MÈRE-ÉGLISE Skirmish  | <sub>St. Mere Eglise   | <sub>Warfare   | <sub>Night       | <sub>          |
| <sub>`stalingrad_offensive_ger`            | <sub>`Stalin`               | <sub>STALINGRAD Offensive         | <sub>Stalingrad        | <sub>Offensive | <sub>Day         | <sub>GER       |
| <sub>`stalingrad_offensive_rus`            | <sub>`Stalin`               | <sub>STALINGRAD Offensive         | <sub>Stalingrad        | <sub>Offensive | <sub>Day         | <sub>RUS       |
| <sub>`stalingrad_warfare`                  | <sub>`Stalin`               | <sub>STALINGRAD Warfare           | <sub>Stalingrad        | <sub>Warfare   | <sub>Day         | <sub>          |
| <sub>`stalingrad_warfare_night`            | <sub>`Stalin_N`             | <sub>STALINGRAD Warfare           | <sub>Stalingrad        | <sub>Warfare   | <sub>Night       | <sub>          |
| <sub>`stmariedumont_off_ger`               | <sub>`StMarie`              | <sub>ST MARIE DU MONT OFF         | <sub>St. Marie Du Mont | <sub>Offensive | <sub>Day         | <sub>GER       |
| <sub>`stmariedumont_off_us`                | <sub>`StMarie`              | <sub>ST MARIE DU MONT OFF         | <sub>St. Marie Du Mont | <sub>Offensive | <sub>Day         | <sub>US        |
| <sub>`stmariedumont_warfare`               | <sub>`StMarie`              | <sub>ST MARIE DU MONT Warfare     | <sub>St. Marie Du Mont | <sub>Warfare   | <sub>Day         | <sub>          |
| <sub>`stmariedumont_warfare_night`         | <sub>`StMarie_N`            | <sub>ST MARIE DU MONT Warfare     | <sub>St. Marie Du Mont | <sub>Warfare   | <sub>Night       | <sub>          |
| <sub>`stmereeglise_offensive_ger`          | <sub>`SME`                  | <sub>SAINTE-MÈRE-ÉGLISE Offensive | <sub>St. Mere Eglise   | <sub>Offensive | <sub>Dawn        | <sub>GER       |
| <sub>`stmereeglise_offensive_us`           | <sub>`SME`                  | <sub>SAINTE-MÈRE-ÉGLISE Offensive | <sub>St. Mere Eglise   | <sub>Offensive | <sub>Day         | <sub>US        |
| <sub>`stmereeglise_warfare`                | <sub>`SME`                  | <sub>SAINTE-MÈRE-ÉGLISE Warfare   | <sub>St. Mere Eglise   | <sub>Warfare   | <sub>Day         | <sub>          |
| <sub>`stmereeglise_warfare_night`          | <sub>`SME_N`                | <sub>SAINTE-MÈRE-ÉGLISE Warfare   | <sub>St. Mere Eglise   | <sub>Warfare   | <sub>Night       | <sub>          |
| <sub>`tobruk_offensiveger_day`             | <sub>`DEV_O`                | <sub>TOBRUK Offensive             | <sub>Tobruk            | <sub>Offensive | <sub>Day         | <sub>DAK       |
| <sub>`tobruk_offensiveger_morning`         | <sub>`DEV_O_Morning`        | <sub>TOBRUK Offensive             | <sub>Tobruk            | <sub>Offensive | <sub>Dawn        | <sub>DAK       |
| <sub>`tobruk_offensiveger_dusk`            | <sub>`DEV_O_Dusk`           | <sub>TOBRUK Offensive             | <sub>Tobruk            | <sub>Offensive | <sub>Dusk        | <sub>DAK       |
| <sub>`tobruk_offensivebritish_day`         | <sub>`DEV_O`                | <sub>TOBRUK Offensive             | <sub>Tobruk            | <sub>Offensive | <sub>Day         | <sub>B8A       |
| <sub>`tobruk_offensivebritish_morning`     | <sub>`DEV_O_Morning`        | <sub>TOBRUK Offensive             | <sub>Tobruk            | <sub>Offensive | <sub>Dawn        | <sub>B8A       |
| <sub>`tobruk_offensivebritish_dusk`        | <sub>`DEV_O_Dusk`           | <sub>TOBRUK Offensive             | <sub>Tobruk            | <sub>Offensive | <sub>Dusk        | <sub>B8A       |
| <sub>`tobruk_skirmish_day`                 | <sub>`DEV_O_DAY_SKM`        | <sub>TOBRUK Skirmish              | <sub>Tobruk            | <sub>Skirmish  | <sub>Day         | <sub>          |
| <sub>`tobruk_skirmish_morning`             | <sub>`DEV_O_MORNING_SKM`    | <sub>TOBRUK Skirmish              | <sub>Tobruk            | <sub>Skirmish  | <sub>Dawn        | <sub>          |
| <sub>`tobruk_skirmish_dusk`                | <sub>`DEV_O_DUSK_SKM`       | <sub>TOBRUK Skirmish              | <sub>Tobruk            | <sub>Skirmish  | <sub>Dusk        | <sub>          |
| <sub>`tobruk_warfare_day`                  | <sub>`DEV_O`                | <sub>TOBRUK Warfare               | <sub>Tobruk            | <sub>Warfare   | <sub>Day         | <sub>          |
| <sub>`tobruk_warfare_morning`              | <sub>`DEV_O_Morning`        | <sub>TOBRUK Warfare               | <sub>Tobruk            | <sub>Warfare   | <sub>Dawn        | <sub>          |
| <sub>`tobruk_warfare_dusk`                 | <sub>`DEV_O_Dusk`           | <sub>TOBRUK Warfare               | <sub>Tobruk            | <sub>Warfare   | <sub>Dusk        | <sub>          |
| <sub>`utahbeach_offensive_ger`             | <sub>`Utah`                 | <sub>UTAH BEACH Offensive         | <sub>Utah Beach        | <sub>Offensive | <sub>Day         | <sub>GER       |
| <sub>`utahbeach_offensive_us`              | <sub>`Utah`                 | <sub>UTAH BEACH Offensive         | <sub>Utah Beach        | <sub>Offensive | <sub>Day         | <sub>US        |
| <sub>`utahbeach_warfare`                   | <sub>`Utah`                 | <sub>UTAH BEACH Warfare           | <sub>Utah Beach        | <sub>Warfare   | <sub>Day         | <sub>          |
| <sub>`utahbeach_warfare_night`             | <sub>`Utah_N`               | <sub>UTAH BEACH Warfare           | <sub>Utah Beach        | <sub>Warfare   | <sub>Night       | <sub>          |

<sup>\* This is how the map appears in the `MATCH START` and `MATCH ENDED` log lines.
<br>\*\* Lowercase in the output of the `Get Map` and `Get Gamestate` commands.
<br>\*\*\* This map is currently only available in PTEs.

# Available Weapons

> [!WARNING]
> The British melee weapon uses a so-called "En Dash" character (–) as opposed to the standard hyphen (-).

## **Firearms**

| Category                                | United States (US)                                  | Germany (GER)                                      | Soviet Union (RUS)                                                    | Great Britain (GB)                                                              |
|-----------------------------------------|-----------------------------------------------------|----------------------------------------------------|-----------------------------------------------------------------------|---------------------------------------------------------------------------------|
| **Submachine Guns** <br> <br> <br> <br> | `M1A1 THOMPSON`, <br>`M3 GREASE GUN` <br> <br> <br> | `MP40` <br> <br> <br> <br>                         | `PPSH 41`, <br>`PPSH 41 W/DRUM` <br> <br> <br>                        | `Sten Gun Mk.II`, <br>`Sten Gun Mk.V`, <br>`Lanchester`, <br>`M1928A1 THOMPSON` |
| **Semi-Auto Rifles** <br> <br>          | `M1 GARAND`, <br>`M1 CARBINE`                       | `GEWEHR 43` <br> <br>                              | `SVT40` <br> <br>                                                     |                                                                                 |
| **Bolt-Action Rifles** <br> <br>        |                                                     | `KARABINER 98K` <br> <br> <br>                     | `MOSIN NAGANT 1891`, <br>`MOSIN NAGANT 91/30`, <br>`MOSIN NAGANT M38` | `SMLE No.1 Mk III`, <br>`Rifle No.4 Mk I`, <br>`Rifle No.5 Mk I`                |
| **Assault Rifles** <br> <br>            | `M1918A2 BAR` <br> <br>                             | `STG44`, <br>`FG42`                                |                                                                       | `Bren Gun` <br> <br>                                                            |
| **Shotguns**                            | `M97 TRENCH GUN`                                    |                                                    |                                                                       |                                                                                 |
| **Machine Guns** <br> <br>              | `BROWNING M1919` <br> <br>                          | `MG34`, <br>`MG42`                                 | `DP-27` <br> <br>                                                     | `Lewis Gun` <br> <br>                                                           |
| **Sniper Rifles** <br> <br>             | `M1919 SPRINGFIELD` <br> <br>                       | `KARABINER 98K x8`, <br>`FG42 x4`                  | `SCOPED MOSIN NAGANT 91/30`, <br>`SCOPED SVT40`                       | `Lee-Enfield Pattern 1914 Sniper`, <br>`Rifle No.4 Mk I Sniper`                 |
| **Pistols** <br> <br>                   | `COLT M1911` <br> <br>                              | `WALTHER P38`, <br>`LUGER P08`                     | `NAGANT M1895`, <br>`TOKAREV TT33`                                    | `Webley MK VI` <br> <br>                                                        |
| **Flamethrowers**                       | `M2 FLAMETHROWER`                                   | `FLAMMENWERFER 41`                                 |                                                                       | `FLAMETHROWER`                                                                  |
| **Melee Weapons**                       | `M3 KNIFE`                                          | `FELDSPATEN`                                       | `MPL-50 SPADE`                                                        | `Fairbairn–Sykes`                                                               |
| **Grenades** <br> <br>                  | `MK2 GRENADE` <br> <br>                             | `M24 STIELHANDGRANATE`, <br>`M43 STIELHANDGRANATE` | `RG-42 GRENADE`, <br>`MOLOTOV`                                        | `Mills Bomb`, <br>`No.82 Grenade`                                               |
| **Satchel Charges**                     | `SATCHEL`                                           | `SATCHEL`                                          | `SATCHEL CHARGE`                                                      | `Satchel`                                                                       |
| **Anti-Personnel Mines**                | `M2 AP MINE`                                        | `S-MINE`                                           | `POMZ AP MINE`                                                        | `A.P. Shrapnel Mine Mk II`                                                      |
| **Anti-Tank Mines**                     | `M1A1 AT MINE`                                      | `TELLERMINE 43`                                    | `TM-35 AT MINE`                                                       | `A.T. Mine G.S. Mk V`                                                           |
| **Anti-Tank Rifles** <br> <br>          | `BAZOOKA` <br> <br>                                 | `PANZERSCHRECK` <br> <br>                          | `PTRS-41`, <br>`BAZOOKA`                                              | `PIAT`, <br>`Boys Anti-tank Rifle`                                              |
| **Flare Guns**                          | `FLARE GUN`                                         | `FLARE GUN`                                        | `FLARE GUN`                                                           | `No.2 Mk 5 Flare Pistol`                                                        |

## **Deployables**

| Category           | United States (US)      | Germany (GER)             | Soviet Union (RUS)              | Great Britain (GB)              |
|--------------------|-------------------------|---------------------------|---------------------------------|---------------------------------|
| **Artillery Guns** | `155MM HOWITZER [M114]` | `150MM HOWITZER [sFH 18]` | `122MM HOWITZER [M1938 (M-30)]` | `QF 25-POUNDER [QF 25-Pounder]` |
| **Anti-Tank Guns** | `57MM CANNON [M1 57mm]` | `75MM CANNON [PAK 40]`    | `57MM CANNON [ZiS-2]`           | `QF 6-POUNDER [QF 6-Pounder]`   |

## **Vehicles (Roadkills)**

| Category                       | United States (US)                                      | Germany (GER)                                            | Soviet Union (RUS)                        | Great Britain (GB)                                        |
|--------------------------------|---------------------------------------------------------|----------------------------------------------------------|-------------------------------------------|-----------------------------------------------------------|
| **Recon Vehicles**             | `M8 Greyhound`                                          | `Sd.Kfz.234 Puma`                                        | `BA-10`                                   | `Daimler`                                                 |
| **Light Tanks**                | `Stuart M5A1` <br> <br>                                 | `Sd.Kfz.121 Luchs` <br> <br>                             | `T70` <br> <br>                           | `Tetrarch`, <br>`M3 Stuart Honey`                         |
| **Medium Tanks**               | `Sherman M4A3(75)W` <br> <br>                           | `Sd.Kfz.161 Panzer IV` <br> <br>                         | `T34/76` <br> <br>                        | `Cromwell`, <br>`Crusader Mk.III`                         |
| **Heavy Tanks** <br> <br> <br> | `Sherman M4A3E2`, <br>`Sherman M4A3E2(76)` <br> <br>    | `Sd.Kfz.181 Tiger 1`, <br>`Sd.Kfz.171 Panther` <br> <br> | `IS-1` <br> <br> <br>                     | `Firefly`, <br>`Churchill Mk.III`, <br>`Churchill Mk.VII` |
| **Half-tracks**                | `M3 Half-track`                                         | `Sd.Kfz 251 Half-track`                                  | `M3 Half-track`                           | `M3 Half-track`                                           |
| **Trucks** <br> <br>           | `GMC CCKW 353 (Transport)`, <br>`GMC CCKW 353 (Supply)` | `Opel Blitz (Transport)`, <br>`Opel Blitz (Supply)`      | `ZIS-5 (Transport)`, <br>`ZIS-5 (Supply)` | `Bedford OYD (Transport)`, <br>`Bedford OYD (Supply)`     |
| **Jeeps**                      | `Jeep Willys`                                           | `Kubelwagen`                                             | `GAZ-67`                                  | `Jeep Willys`                                             |

## **Vehicles (Armament)**

> [!WARNING]
> If a vehicle gets destroyed, any kills made with said vehicle that get counted after its destruction will have the
> vehicle name excluded from the weapon name. Eg. "COAXIAL M1919 [M8 Greyhound]" would become "COAXIAL M1919"

### **M8 Greyhound**

Recon Vehicle - United States (US)

| Category                | Name                           |
|-------------------------|--------------------------------|
| **Main Cannon**         | `M6 37mm [M8 Greyhound]`       |
| **Coaxial Machine Gun** | `COAXIAL M1919 [M8 Greyhound]` |

### **Stuart M5A1**

Light Tank - United States (US)

| Category                | Name                          |
|-------------------------|-------------------------------|
| **Main Cannon**         | `37MM CANNON [Stuart M5A1]`   |
| **Coaxial Machine Gun** | `COAXIAL M1919 [Stuart M5A1]` |
| **Hull Machine Gun**    | `HULL M1919 [Stuart M5A1]`    |

### **Sherman M4A3(75)W**

Medium Tank - United States (US)

| Category                | Name                                |
|-------------------------|-------------------------------------|
| **Main Cannon**         | `75MM CANNON [Sherman M4A3(75)W]`   |
| **Coaxial Machine Gun** | `COAXIAL M1919 [Sherman M4A3(75)W]` |
| **Hull Machine Gun**    | `HULL M1919 [Sherman M4A3(75)W]`    |

### **Sherman M4A3E2 "75mm"**

Heavy Tank - United States (US)

| Category                | Name                             |
|-------------------------|----------------------------------|
| **Main Cannon**         | `75MM M3 GUN [Sherman M4A3E2]`   |
| **Coaxial Machine Gun** | `COAXIAL M1919 [Sherman M4A3E2]` |
| **Hull Machine Gun**    | `HULL M1919 [Sherman M4A3E2]`    |

### **Sherman M4A3E2 "76mm"**

Heavy Tank - United States (US)

| Category                | Name                                 |
|-------------------------|--------------------------------------|
| **Main Cannon**         | `76MM M1 GUN [Sherman M4A3E2(76)]`   |
| **Coaxial Machine Gun** | `COAXIAL M1919 [Sherman M4A3E2(76)]` |
| **Hull Machine Gun**    | `HULL M1919 [Sherman M4A3E2(76)]`    |

### **M3 Half-track**

Half-track - United States (US), Soviet Union (RUS) & Great Britain (GB)

| Category                | Name                          |
|-------------------------|-------------------------------|
| **Mounted Machine Gun** | `M2 Browning [M3 Half-track]` |

### **Sd.Kfz.234 Puma**

Recon Vehicle - Germany (GER)

| Category                | Name                              |
|-------------------------|-----------------------------------|
| **Main Cannon**         | `50mm KwK 39/1 [Sd.Kfz.234 Puma]` |
| **Coaxial Machine Gun** | `COAXIAL MG34 [Sd.Kfz.234 Puma]`  |

### **Sd.Kfz.121 Luchs**

Light Tank - Germany (GER)

| Category                | Name                              |
|-------------------------|-----------------------------------|
| **Main Cannon**         | `20MM KWK 30 [Sd.Kfz.121 Luchs]`  |
| **Coaxial Machine Gun** | `COAXIAL MG34 [Sd.Kfz.121 Luchs]` |

### **Sd.Kfz.161 Panzer IV**

Medium Tank - Germany (GER)

| Category                | Name                                  |
|-------------------------|---------------------------------------|
| **Main Cannon**         | `75MM CANNON [Sd.Kfz.161 Panzer IV]`  |
| **Coaxial Machine Gun** | `COAXIAL MG34 [Sd.Kfz.161 Panzer IV]` |
| **Hull Machine Gun**    | `HULL MG34 [Sd.Kfz.161 Panzer IV]`    |

### **Sd.Kfz.171 Panther**

Heavy Tank - Germany (GER)

| Category                | Name                                |
|-------------------------|-------------------------------------|
| **Main Cannon**         | `75MM CANNON [Sd.Kfz.171 Panther]`  |
| **Coaxial Machine Gun** | `COAXIAL MG34 [Sd.Kfz.171 Panther]` |
| **Hull Machine Gun**    | `HULL MG34 [Sd.Kfz.171 Panther]`    |

### **Sd.Kfz.181 Tiger 1**

Heavy Tank - Germany (GER)

| Category                | Name                                  |
|-------------------------|---------------------------------------|
| **Main Cannon**         | `88 KWK 36 L/56 [Sd.Kfz.181 Tiger 1]` |
| **Coaxial Machine Gun** | `COAXIAL MG34 [Sd.Kfz.181 Tiger 1]`   |
| **Hull Machine Gun**    | `HULL MG34 [Sd.Kfz.181 Tiger 1]`      |

### **Sd.Kfz 251 Half-track**

Half-track - Germany (GER)

| Category                | Name                            |
|-------------------------|---------------------------------|
| **Mounted Machine Gun** | `MG 42 [Sd.Kfz 251 Half-track]` |

### **BA-10**

Recon Vehicle - Soviet Union (RUS)

| Category                | Name                 |
|-------------------------|----------------------|
| **Main Cannon**         | `19-K 45MM [BA-10]`  |
| **Coaxial Machine Gun** | `COAXIAL DT [BA-10]` |

### **T70**

Light Tank - Soviet Union (RUS)

| Category                | Name               |
|-------------------------|--------------------|
| **Main Cannon**         | `45MM M1937 [T70]` |
| **Coaxial Machine Gun** | `COAXIAL DT [T70]` |

### **T34/76**

Medium Tank - Soviet Union (RUS)

| Category                | Name                  |
|-------------------------|-----------------------|
| **Main Cannon**         | `76MM ZiS-5 [T34/76]` |
| **Coaxial Machine Gun** | `COAXIAL DT [T34/76]` |
| **Hull Machine Gun**    | `HULL DT [T34/76]`    |

### **IS-1**

Heavy Tank - Soviet Union (RUS)

| Category                | Name                |
|-------------------------|---------------------|
| **Main Cannon**         | `D-5T 85MM [IS-1]`  |
| **Coaxial Machine Gun** | `COAXIAL DT [IS-1]` |
| **Hull Machine Gun**    | `HULL DT [IS-1]`    |

### **Daimler**

Recon Vehicle - Great Britain (GB)

| Category                | Name                     |
|-------------------------|--------------------------|
| **Main Cannon**         | `QF 2-POUNDER [Daimler]` |
| **Coaxial Machine Gun** | `COAXIAL BESA [Daimler]` |

### **Tetrarch**

Light Tank - Great Britain (GB)

| Category                | Name                      |
|-------------------------|---------------------------|
| **Main Cannon**         | `QF 2-POUNDER [Tetrarch]` |
| **Coaxial Machine Gun** | `COAXIAL BESA [Tetrarch]` |

### **M3 Stuart Honey**

Light Tank - Great Britain (GB)

| Category                | Name                              |
|-------------------------|-----------------------------------|
| **Main Cannon**         | `37MM CANNON [M3 Stuart Honey]`   |
| **Coaxial Machine Gun** | `COAXIAL M1919 [M3 Stuart Honey]` |
| **Hull Machine Gun**    | `HULL M1919 [M3 Stuart Honey]`    |

### **Cromwell**

Medium Tank - Great Britain (GB)

| Category                | Name                      |
|-------------------------|---------------------------|
| **Main Cannon**         | `OQF 75MM [Cromwell]`     |
| **Coaxial Machine Gun** | `COAXIAL BESA [Cromwell]` |
| **Hull Machine Gun**    | `HULL BESA [Cromwell]`    |

### **Crusader Mk.III**

Medium Tank - Great Britain (GB)

| Category                | Name                             |
|-------------------------|----------------------------------|
| **Main Cannon**         | `OQF 57MM [Crusader Mk.III]`     |
| **Coaxial Machine Gun** | `COAXIAL BESA [Crusader Mk.III]` |

### **Firefly**

Heavy Tank - Great Britain (GB)

| Category                | Name                      |
|-------------------------|---------------------------|
| **Main Cannon**         | `QF 17-POUNDER [Firefly]` |
| **Coaxial Machine Gun** | `COAXIAL M1919 [Firefly]` |

### **Churchill Mk.III**

Heavy Tank - Great Britain (GB)

| Category                | Name                                     |
|-------------------------|------------------------------------------|
| **Main Cannon**         | `OQF 57MM [Churchill Mk.III]`            |
| **Coaxial Machine Gun** | `COAXIAL BESA 7.92mm [Churchill Mk.III]` |
| **Hull Machine Gun**    | `HULL BESA 7.92mm [Churchill Mk.III]`    |

### **Churchill Mk.VII**

Heavy Tank - Great Britain (GB)

| Category                | Name                                     |
|-------------------------|------------------------------------------|
| **Main Cannon**         | `OQF 57MM [Churchill Mk.VII]`            |
| **Coaxial Machine Gun** | `COAXIAL BESA 7.92mm [Churchill Mk.VII]` |
| **Hull Machine Gun**    | `HULL BESA 7.92mm [Churchill Mk.VII]`    |

## **Commander Abilities**

Names are the same across all factions.

| Category             | Name               |
|----------------------|--------------------|
| **Bombing Run**      | `BOMBING RUN`      |
| **Strafing Run**     | `STRAFING RUN`     |
| **Precision Strike** | `PRECISION STRIKE` |
| ***                  |                    |
| Katyusha Barrage**   | `Unknown`          |

<sup>* As in, kills with a Katyusha Barrage actually show up as "Unknown"

## **Removed Weapons**

| Name                       | Comment                                           |
|----------------------------|---------------------------------------------------|
| `Lee-Enfield Pattern 1914` | Removed in U14.5 in favor of the SMLE No.1 Mk III |

## **Bugged Weapon Names**

| Name       | Comment                                                                                                                                                                                                                                                                   |
|------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `FireSpot` | Is seen very rarely when a player on RUS team playing as Assault role kills an enemy. Supposedly this is related to the Molotovs you get with one the role's loadouts. What causes it to show up as "FireSpot" and not "MOLOTOV" is unknown and requires further testing. |
| `UNKNOWN`  | Can be observed when the reference to the killing soldier is lost. This is generally whenever a bleeding out player gives up after the player that downed him was killed or has disconnected.                                                                             |
