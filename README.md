<div align="center">
<img src="https://github.com/hllplanner/hll-ircon/blob/master/.github/resources/ircon-primary-logo-transparent-slim.png">
<div id="toc">
  <ul style="list-style: none">
    <summary>
      <h1>HLL Integrated RCON</h1>
    </summary>
  </ul>
</div>
<h3>A NodeJS library to interact with Hell Let Loose's RCONv1 and RCONv2 APIs</h3>
</div>

---

## Installation

```bash
yarn add hll-ircon
...
npm i hll-ircon
```

## Getting Started

```js
const { IRCONClient } = require("hll-ircon");

const client = new IRCONClient({
  host: "127.0.0.1",
  port: "8000",
  password: "RCON_PASSWORD"
});

client.on("ready", async () => {
  const serverName = await client.v2.server.getServerName();
  console.log(`Logged in to server: ${serverName}`);
});
```

## [Read The Full Documentation](https://ircon.hllplanner.net)

---

## Coverage

| <sub> Action                                                | <sub> v1 Command Name             | <sub> v1 Coverage | <sub> v2 Command Name                     | <sub> v2 Coverage | <sub> Implemented In  |
|-------------------------------------------------------------|-----------------------------------|:------------------|-------------------------------------------|-------------------|-----------------------|
| <sub> Set Map                                               | <sub> Map                         | <sub> ✅           | <sub> ChangeMap                           | <sub> ✅           | <sub> SessionManager  |
| <sub> Get Map                                               | <sub> Get Map                     | <sub> ✅           | <sub> ServerInformation(name=session)     | <sub> ✅           | <sub> SessionManager  |
| <sub> Set Sector Layout                                     | <sub> GameLayout                  | <sub> ✅           | <sub> ChangeSectorLayout                  | <sub> ✅           | <sub> SessionManager  |
| <sub> Get Sector Layout                                     | <sub> Get ObjectiveRow_(0-4)      | <sub> ✅           | <sub> N/A*                                | <sub> N/A*        | <sub> SessionManager  |
| <sub> Server Broadcast                                      | <sub> Broadcast                   | <sub> ✅           | <sub> ServerBroadcast                     | <sub> ✅           | <sub> SessionManager  |
| <sub> Get Game State (player #, score, time, map, next map) | <sub> Get GameState               | <sub> ✅           | <sub> N/A*                                | <sub> N/A*        | <sub> SessionManager  |
| <sub> Get Maps For Rotation                                 | <sub> Get MapsForRotation         | <sub> ✅           | <sub> N/A*                                | <sub> N/A*        | <sub> MapManager      |
| <sub> Get Maps In Rotation                                  | <sub> RotList                     | <sub> ✅           | <sub> N/A*                                | <sub> N/A*        | <sub> MapManager      |
| <sub> Add Map to Rotation                                   | <sub> RotAdd                      | <sub> ✅           | <sub> AddMapToRotation                    | <sub> ✅           | <sub> MapManager      |
| <sub> Remove Map From Rotation                              | <sub> RotDel                      | <sub> ✅           | <sub> RemoveMapFromRotation               | <sub> ✅           | <sub> MapManager      |
| <sub> Set Map Sequence Shuffling                            | <sub> ToggleMapShuffle            | <sub> ✅           | <sub> ShuffleMapSequence                  | <sub> ✅           | <sub> MapManager      |
| <sub> Get Map Sequence Shuffling Enabled                    | <sub> QueryMapShuffle             | <sub> ✅           | <sub> N/A*                                | <sub> N/A*        | <sub> MapManager      |
| <sub> List Current Map Sequence                             | <sub> ListCurrentMapSequence      | <sub> ✅           | <sub> ServerInformation(name=mapsequence) | <sub> ✅           | <sub> MapManager      |
| <sub> Add Map to Sequence                                   | <sub> N/A*                        | <sub> N/A*        | <sub> AddMapToSequence                    | <sub> ✅           | <sub> MapManager      |
| <sub> Remove Map From Sequence                              | <sub> N/A*                        | <sub> N/A*        | <sub> RemoveMapFromSequence               | <sub> ✅           | <sub> MapManager      |
| <sub> Move Map in Sequence                                  | <sub> N/A*                        | <sub> N/A*        | <sub> MoveMapInSequence                   | <sub> ✅           | <sub> MapManager      |
| <sub> Set Team Switch Cooldown                              | <sub> SetTeamSwitchCooldown       | <sub> ✅           | <sub> TeamSwitchCooldown                  | <sub> ✅           | <sub> ServerManager   |
| <sub> Get Team Switch Cooldown                              | <sub> Get TeamSwitchCooldown      | <sub> ✅           | <sub> N/A*                                | <sub> N/A*        | <sub> ServerManager   |
| <sub> Set Max Queued Players                                | <sub> SetMaxQueuedPlayers         | <sub> ✅           | <sub> SetMaxQueuedPlayers                 | <sub> ✅           | <sub> ServerManager   |
| <sub> Get Max Queued Players                                | <sub> Get MaxQueuedPlayers        | <sub> ✅           | <sub> ServerInformation(name=session)     | <sub> ✅           | <sub> ServerManager   |
| <sub> Set Idle Kick Duration                                | <sub> SetKickIdleTime             | <sub> ✅           | <sub> SetIdleKickDuration                 | <sub> ✅           | <sub> ServerManager   |
| <sub> Get Idle Kick Duration                                | <sub> Get IdleTime                | <sub> ✅           | <sub> N/A*                                | <sub> N/A*        | <sub> ServerManager   |
| <sub> Set High Ping Threshold                               | <sub> SetHighPing                 | <sub> ✅           | <sub> SetHighPingThreshold                | <sub> ✅           | <sub> ServerManager   |
| <sub> Get High Ping Threshold                               | <sub> Get HighPing                | <sub> ✅           | <sub> N/A*                                | <sub> N/A*        | <sub> ServerManager   |
| <sub> Get Current/Max Slots                                 | <sub> Get Slots                   | <sub> ✅           | <sub> ServerInformation(name=session)     | <sub> ✅           | <sub> ServerManager   |
| <sub> Set Server/Welcome Message                            | <sub> Say                         | <sub> ✅           | <sub> SendServerMessage                   | <sub> ✅           | <sub> ServerManager   |
| <sub> Get Server Name                                       | <sub> Get Name                    | <sub> ✅           | <sub> ServerInformation(name=session)     | <sub> ✅           | <sub> ServerManager   |
| <sub> Set Auto Balance Enabled                              | <sub> SetAutoBalanceEnabled       | <sub> ✅           | <sub> AutoBalance                         | <sub> ✅           | <sub> ServerManager   |
| <sub> Get Auto Balance Enabled                              | <sub> Get AutoBalanceEnabled      | <sub> ✅           | <sub> N/A*                                | <sub> N/A*        | <sub> ServerManager   |
| <sub> Set Auto Balance Threshold                            | <sub> SetAutoBalanceThreshold     | <sub> ✅           | <sub> AutoBalanceThreshold                | <sub> ✅           | <sub> ServerManager   |
| <sub> Get Auto Balance Threshold                            | <sub> Get AutoBalanceThreshold    | <sub> ✅           | <sub> N/A*                                | <sub> N/A*        | <sub> ServerManager   |
| <sub> Set Vote Kick Enabled                                 | <sub> SetVoteKickEnabled          | <sub> ✅           | <sub> VoteKickEnabled                     | <sub> ✅           | <sub> ServerManager   |
| <sub> Get Vote Kick Enabled                                 | <sub> Get VoteKickEnabled         | <sub> ✅           | <sub> N/A*                                | <sub> N/A*        | <sub> ServerManager   |
| <sub> Set Vote to Kick Threshold                            | <sub> SetVoteKickThreshold        | <sub> ✅           | <sub> VoteKickThreshold                   | <sub> ✅           | <sub> ServerManager   |
| <sub> Get Vote to Kick Threshold                            | <sub> Get VoteKickThreshold       | <sub> ✅           | <sub> N/A*                                | <sub> N/A*        | <sub> ServerManager   |
| <sub> Reset Vote to Kick Threshold                          | <sub> ResetVoteKickThreshold      | <sub> ✅           | <sub> ResetKickThreshold                  | <sub> ✅           | <sub> ServerManager   |
| <sub> Set RCON password                                     | <sub> RconPassword                | <sub> ✅           | <sub> N/A*                                | <sub> N/A*        | <sub> ServerManager   |
| <sub> Set VIP Slot Count                                    | <sub> SetNumVipSlots              | <sub> ✅           | <sub> N/A*                                | <sub> N/A*        | <sub> ServerManager   |
| <sub> Get VIP Slot Count                                    | <sub> Get NumVipSlots             | <sub> ✅           | <sub> N/A*                                | <sub> N/A*        | <sub> ServerManager   |
| <sub> Get Profanities                                       | <sub> Get Profanity               | <sub> ✅           | <sub> N/A*                                | <sub> N/A*        | <sub> ServerManager   |
| <sub> Add Profanities                                       | <sub> BanProfanity                | <sub> ✅           | <sub> N/A*                                | <sub> N/A*        | <sub> ServerManager   |
| <sub> Remove Profanities                                    | <sub> UnbanProfanity              | <sub> ✅           | <sub> N/A*                                | <sub> N/A*        | <sub> ServerManager   |
| <sub> List Players                                          | <sub> Get Players / Get PlayerIDs | <sub> ✅           | <sub> ServerInformation(name=players)     | <sub> ✅           | <sub> PlayerManager   |
| <sub> Get Detailed Player Information                       | <sub> PlayerInfo                  | <sub> ✅           | <sub> ServerInformation(name=player)      | <sub> ✅           | <sub> PlayerManager   |
| <sub> Message Player                                        | <sub> Message                     | <sub> ✅           | <sub> MessagePlayer                       | <sub> ✅           | <sub> PlayerManager   |
| <sub> Punish Player                                         | <sub> Punish                      | <sub> ✅           | <sub> PunishPlayer                        | <sub> ✅           | <sub> PlayerManager   |
| <sub> Kick                                                  | <sub> Kick                        | <sub> ✅           | <sub> Kick                                | <sub> ✅           | <sub> PlayerManager   |
| <sub> List Temporary Bans                                   | <sub> Get TempBans                | <sub> ✅           | <sub> N/A*                                | <sub> N/A*        | <sub> PlayerManager   |
| <sub> Temporary Ban                                         | <sub> TempBan                     | <sub> ✅           | <sub> TempBan                             | <sub> ✅           | <sub> PlayerManager   |
| <sub> Remove Temporary Ban                                  | <sub> PardonTempBan               | <sub> ✅           | <sub> RemoveTempBan                       | <sub> ✅           | <sub> PlayerManager   |
| <sub> List Permanent Bans                                   | <sub> Get PermaBans               | <sub> ✅           | <sub> N/A*                                | <sub> N/A*        | <sub> PlayerManager   |
| <sub> Permanent Ban                                         | <sub> PermaBan                    | <sub> ✅           | <sub> PermanentBan                        | <sub> ✅           | <sub> PlayerManager   |
| <sub> Remove Permanent Ban                                  | <sub> PardonPermaBan              | <sub> ✅           | <sub> RemovePermanentBan                  | <sub> ✅           | <sub> PlayerManager   |
| <sub> Make Player Switch Team on Death                      | <sub> SwitchTeamOnDeath           | <sub> ✅           | <sub> N/A*                                | <sub> N/A*        | <sub> PlayerManager   |
| <sub> Make Player Switch Team Immediately                   | <sub> SwitchTeamNow               | <sub> ✅           | <sub> N/A*                                | <sub> N/A*        | <sub> PlayerManager   |
| <sub> Add VIP                                               | <sub> VipAdd                      | <sub> ✅           | <sub> N/A*                                | <sub> N/A*        | <sub> PlayerManager   |
| <sub> Remove VIP                                            | <sub> VipDel                      | <sub> ✅           | <sub> N/A*                                | <sub> N/A*        | <sub> PlayerManager   |
| <sub> Get VIPs                                              | <sub> Get vipids                  | <sub> ✅           | <sub> N/A*                                | <sub> N/A*        | <sub> PlayerManage    |
| <sub> Add Admin                                             | <sub> AdminAdd                    | <sub> ✅           | <sub> AddAdmin                            | <sub> ✅           | <sub> AdminManager    |
| <sub> Remove Admin                                          | <sub> AdminDel                    | <sub> ✅           | <sub> RemoveAdmin                         | <sub> ✅           | <sub> AdminManager    |
| <sub> List Admins                                           | <sub> Get AdminIds                | <sub> ✅           | <sub> N/A*                                | <sub> N/A*        | <sub> AdminManager    |
| <sub> List Admin Groups                                     | <sub> Get AdminGroups             | <sub> ✅           | <sub> N/A*                                | <sub> N/A*        | <sub> AdminManager    |
| <sub> Displayable Commands                                  | <sub> Help                        | <sub> ❌           | <sub> DisplayableCommands                 | <sub> ❌           | <sub> RCONClientV2 ** |
| <sub> Client Reference Data                                 | <sub> **Help Command? **          | <sub> ❌           | <sub> ClientReferenceData                 | <sub> ❌           | <sub> RCONClientV2 ** |
| <sub> Admin Log                                             | <sub> ShowLog                     | <sub> ✅           | <sub> AdminLog                            | <sub> ✅           | <sub> LogManager      |

<sub>*N/A\* Some methods supported by RCONv1 are not supported by RCONv2, and vice versa.*</sub><br/>

# TODO

- Better support for map logging - Differentiate map name from gamemode - Create list of all maps and relevant data
- Manually fix annoying capitalization schemas in v2 api