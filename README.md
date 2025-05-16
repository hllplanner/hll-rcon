## HLL Integrated RCON

A NodeJS library to interact with Hell Let Loose RCON v1 and RCON v2.

## Coverage

| <sub> Action                                                | <sub> v1 Command Name       | <sub> v1 Coverage | <sub> v2 Command Name               | <sub> v2 Coverage | <sub> Implemented In        |
|-------------------------------------------------------------|-----------------------------|:------------------|-------------------------------------|-------------------|-----------------------------|
| <sub> Add Admin                                             | AdminAdd                    | ✅                 | AddAdmin                            | ✅                 | AdminManager                |
| <sub> Remove Admin                                          | AdminDel                    | ✅                 | RemoveAdmin                         | ✅                 | AdminManager                |
| <sub> List Admins                                           | Get AdminIds                | ✅                 | N/A*                                | N/A*              | AdminManager                |
| <sub> List Admin Groups                                     | Get AdminGroups             | ✅                 | N/A*                                | N/A*              | AdminManager                |
| <sub> Set Map                                               | Map                         | ✅                 | ChangeMap                           | ✅                 | SessionManager              |
| <sub> Get Map                                               | Get Map                     | ✅                 | ServerInformation(name=session)     | ✅                 | SessionManager              |
| <sub> Set Sector Layout                                     | GameLayout                  | ✅                 | ChangeSectorLayout                  | ✅                 | SessionManager              |
| <sub> Get Sector Layout                                     | Get ObjectiveRow_(0-4)      | ✅                 | N/A*                                | N/A*              | SessionManager              |
| <sub> Server Broadcast                                      | Broadcast                   | ✅                 | ServerBroadcast                     | ✅                 | SessionManager              |
| <sub> Get Game State (player #, score, time, map, next map) | Get GameState               | ❌                 | N/A*                                | N/A*              | SessionManager              |
| <sub> Get Maps For Rotation                                 | Get MapsForRotation         | ❌                 | N/A*                                | N/A*              | ServerManager **            |
| <sub> Get Maps In Rotation                                  | RotList                     | ❌                 | N/A*                                | N/A*              | ServerManager **            |
| <sub> Add Map to Rotation                                   | RotAdd                      | ❌                 | AddMapToRotation                    | ❌                 | ServerManager **            |
| <sub> Remove Map From Rotation                              | RotDel                      | ❌                 | RemoveMapFromRotation               | ❌                 | ServerManager **            |
| <sub> Add Map to Sequence                                   | N/A*                        | N/A*              | AddMapToSequence                    | ❌                 | ServerManager **            |
| <sub> Enable Map Sequence Shuffling                         | ToggleMapShuffle            | ❌                 | ShuffleMapSequence                  | ❌                 | ServerManager **            |
| <sub> Get Map Sequence Shuffling                            | QueryMapShuffle             | ❌                 | N/A*                                | N/A*              | ServerManager **            |
| <sub> List Current Map Sequence                             | ListCurrentMapSequence      | ❌                 | ServerInformation(name=mapsequence) | ❌                 | ServerManager **            |
| <sub> Remove Map From Sequence                              | N/A*                        | N/A*              | RemoveMapFromSequence               | ❌                 | ServerManager **            |
| <sub> Move Map in Sequence                                  | N/A*                        | N/A*              | MoveMapInSequence                   | ❌                 | ServerManager **            |
| <sub> Set Team Switch Cooldown                              | SetTeamSwitchCooldown       | ❌                 | TeamSwitchCooldown                  | ❌                 | ServerManager **            |
| <sub> Get Team Switch Cooldown                              | Get TeamSwitchCooldown      | ❌                 | N/A*                                | N/A*              | ServerManager **            |
| <sub> Set Max Queued Players                                | SetMaxQueuedPlayers         | ❌                 | SetMaxQueuedPlayers                 | ❌                 | ServerManager **            |
| <sub> Get Max Queued Players                                | Get MaxQueuedPlayers        | ❌                 | ServerInformation(name=session)     | ❌                 | ServerManager **            |
| <sub> Set Idle Kick Duration                                | SetKickIdleTime             | ❌                 | SetIdleKickDuration                 | ❌                 | ServerManager **            |
| <sub> Get Idle Kick Duration                                | Get IdleTime                | ❌                 | N/A*                                | N/A*              | ServerManager **            |
| <sub> Set High Ping Threshold                               | SetHighPing                 | ❌                 | SetHighPingThreshold                | ❌                 | ServerManager **            |
| <sub> Get High Ping Threshold                               | Get HighPing                | ❌                 | N/A*                                | N/A*              | ServerManager **            |
| <sub> Get Current/Max Slots                                 | Get Slots                   | ❌                 | ServerInformation(name=session)     | ❌                 | ServerManager **            |
| <sub> Send Server/Welcome Message                           | Say                         | ❌                 | SendServerMessage                   | ✅                 | ServerManager  (TODO: MOVE) |
| <sub> Get Server Name                                       | Get Name                    | ❌                 | ServerInformation(name=session)     | ❌                 | ServerManager **            |
| <sub> List Players                                          | Get Players / Get PlayerIDs | ❌                 | ServerInformation(name=players)     | ❌                 | PlayerManager **            |
| <sub> Get Detailed Player Information                       | PlayerInfo                  | ❌                 | ServerInformation(name=player)      | ❌                 | PlayerManager **            |
| <sub> Message Player                                        | Message                     | ❌                 | MessagePlayer                       | ❌                 | PlayerManager **            |
| <sub> Punish Player                                         | Punish                      | ❌                 | PunishPlayer                        | ❌                 | PlayerManager **            |
| <sub> Kick                                                  | Kick                        | ❌                 | Kick                                | ❌                 | PlayerManager **            |
| <sub> Get Temporary Bans                                    | Get TempBans                | ❌                 | N/A*                                | N/A*              | PlayerManager **            |
| <sub> Temporary Ban                                         | TempBan                     | ❌                 | TempBan                             | ❌                 | PlayerManager **            |
| <sub> Remove Temporary Ban                                  | PardonTempBan               | ❌                 | RemoveTempBan                       | ❌                 | PlayerManager **            |
| <sub> Get Permanent Bans                                    | Get PermaBans               | ❌                 | N/A*                                | N/A*              | PlayerManager **            |
| <sub> Permanent Ban                                         | PermaBan                    | ❌                 | PermanentBan                        | ❌                 | PlayerManager **            |
| <sub> Remove Permanent Ban                                  | PardonPermaBan              | ❌                 | RemovePermanentBan                  | ❌                 | PlayerManager **            |
| <sub> Make Player Switch Team on Death                      | SwitchTeamOnDeath           | ❌                 | N/A*                                | N/A*              | PlayerManager **            |
| <sub> Make Player Switch Team Immediately                   | SwitchTeamNow               | ❌                 | N/A*                                | N/A*              | PlayerManager **            |
| <sub> Set Auto Balance Enabled                              | SetAutoBalanceEnabled       | ❌                 | AutoBalance                         | ❌                 | ServerManager **            |
| <sub> Get Auto Balance Enabled                              | Get AutoBalanceEnabled      | ❌                 | N/A*                                | N/A*              | ServerManager **            |
| <sub> Set Auto Balance Threshold                            | SetAutoBalanceThreshold     | ❌                 | AutoBalanceThreshold                | ❌                 | ServerManager **            |
| <sub> Get Auto Balance Threshold                            | Get AutoBalanceThreshold    | ❌                 | N/A*                                | N/A*              | ServerManager **            |
| <sub> Set Vote Kick Enabled                                 | SetVoteKickEnabled          | ❌                 | VoteKickEnabled                     | ❌                 | ServerManager **            |
| <sub> Get Vote Kick Enabled                                 | Get VoteKickEnabled         | ❌                 | N/A*                                | N/A*              | ServerManager **            |
| <sub> Set Vote to Kick Threshold                            | SetVoteKickThreshold        | ❌                 | VoteKickThreshold                   | ❌                 | ServerManager **            |
| <sub> Get Vote to Kick Threshold                            | Get VoteKickThreshold       | ❌                 | N/A*                                | N/A*              | ServerManager **            |
| <sub> Reset Vote to Kick Threshold                          | ResetVoteKickThreshold      | ❌                 | ResetKickThreshold                  | ❌                 | ServerManager **            |
| <sub> Get Profanities                                       | Get Profanity               | ❌                 | N/A*                                | N/A*              | ProfanityManager **         |
| <sub> Add Profanities                                       | BanProfanity                | ❌                 | N/A*                                | N/A*              | ProfanityManager **         |
| <sub> Remove Profanities                                    | UnbanProfanity              | ❌                 | N/A*                                | N/A*              | ProfanityManager **         |
| <sub> Add VIP                                               | VipAdd                      | ❌                 | N/A*                                | N/A*              | VIPManager **               |
| <sub> Remove VIP                                            | VipDel                      | ❌                 | N/A*                                | N/A*              | VIPManager **               |
| <sub> Get VIPs                                              | Get vipids                  | ❌                 | N/A*                                | N/A*              | VIPManager **               |
| <sub> Set VIP Slot Count                                    | SetNumVipSlots              | ❌                 | N/A*                                | N/A*              | VIPManager **               |
| <sub> Get VIP Slot Count                                    | Get NumVipSlots             | ❌                 | N/A*                                | N/A*              | VIPManager **               |
| <sub> Set RCON password                                     | RconPassword                | ❌                 | N/A*                                | N/A*              | ServerManager **            |
| <sub> Displayable Commands                                  | Help                        | ❌                 | DisplayableCommands                 | ❌                 | RCONClientV2 **             |
| <sub> Client Reference Data                                 | **Help Command? **          | ❌                 | ClientReferenceData                 | ❌                 | RCONClientV2 **             |
| <sub> Admin Log                                             | ShowLog                     | ❌                 | AdminLog                            | ❌                 | LogManager **               |

*N/A\* Some methods supported by RCONv1 are not supported by RCONv2, and vice versa; \*\*Manager not yet implemented.*