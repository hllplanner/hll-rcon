## HLL Integrated RCON

A NodeJS library to interact with Hell Let Loose RCON v1 and RCON v2.

## Coverage

| Action                                                | v1 Command Name             | v1 Coverage | v2 Command Name                     | v2 Coverage | Implemented In              |
|-------------------------------------------------------|-----------------------------|:------------|-------------------------------------|-------------|-----------------------------|
| Add Admin                                             | AdminAdd                    | ✅           | AddAdmin                            | ✅           | AdminManager                |
| Remove Admin                                          | AdminDel                    | ✅           | RemoveAdmin                         | ✅           | AdminManager                |
| List Admins                                           | Get AdminIds                | ✅           | N/A*                                | N/A*        | AdminManager                |
| List Admin Groups                                     | Get AdminGroups             | ✅           | N/A*                                | N/A*        | AdminManager                |
| Change Map                                            | Map                         | ❌           | ChangeMap                           | ✅           | SessionManager              |
| Get Map                                               | Get Map                     | ❌           | ServerInformation(name=session)     | ✅           | SessionManager              |
| Change Sector Layout                                  | GameLayout                  | ❌           | ChangeSectorLayout                  | ✅           | SessionManager              |
| Get Sector Layout                                     | Get ObjectiveRow_(0-4)      | ❌           | N/A*                                | N/A*        | SessionManager **           |
| Server Broadcast                                      | Broadcast                   | ❌           | ServerBroadcast                     | ✅           | SessionManager              |
| Get Game State (player #, score, time, map, next map) | Get GameState               | ❌           | N/A*                                | N/A*        | SessionManager **           |
| Get Maps For Rotation                                 | Get MapsForRotation         | ❌           | N/A*                                | N/A*        | ServerManager **            |
| Get Maps In Rotation                                  | RotList                     | ❌           | N/A*                                | N/A*        | ServerManager **            |
| Add Map to Rotation                                   | RotAdd                      | ❌           | AddMapToRotation                    | ❌           | ServerManager **            |
| Remove Map From Rotation                              | RotDel                      | ❌           | RemoveMapFromRotation               | ❌           | ServerManager **            |
| Add Map to Sequence                                   | N/A*                        | N/A*        | AddMapToSequence                    | ❌           | ServerManager **            |
| Enable Map Sequence Shuffling                         | ToggleMapShuffle            | ❌           | ShuffleMapSequence                  | ❌           | ServerManager **            |
| Get Map Sequence Shuffling                            | QueryMapShuffle             | ❌           | N/A*                                | N/A*        | ServerManager **            |
| List Current Map Sequence                             | ListCurrentMapSequence      | ❌           | ServerInformation(name=mapsequence) | ❌           | ServerManager **            |
| Remove Map From Sequence                              | N/A*                        | N/A*        | RemoveMapFromSequence               | ❌           | ServerManager **            |
| Move Map in Sequence                                  | N/A*                        | N/A*        | MoveMapInSequence                   | ❌           | ServerManager **            |
| Set Team Switch Cooldown                              | SetTeamSwitchCooldown       | ❌           | TeamSwitchCooldown                  | ❌           | ServerManager **            |
| Get Team Switch Cooldown                              | Get TeamSwitchCooldown      | ❌           | N/A*                                | N/A*        | ServerManager **            |
| Set Max Queued Players                                | SetMaxQueuedPlayers         | ❌           | SetMaxQueuedPlayers                 | ❌           | ServerManager **            |
| Get Max Queued Players                                | Get MaxQueuedPlayers        | ❌           | ServerInformation(name=session)     | ❌           | ServerManager **            |
| Set Idle Kick Duration                                | SetKickIdleTime             | ❌           | SetIdleKickDuration                 | ❌           | ServerManager **            |
| Get Idle Kick Duration                                | Get IdleTime                | ❌           | N/A*                                | N/A*        | ServerManager **            |
| Set High Ping Threshold                               | SetHighPing                 | ❌           | SetHighPingThreshold                | ❌           | ServerManager               |
| Get High Ping Threshold                               | Get HighPing                | ❌           | N/A*                                | N/A*        | ServerManager **            |
| Get Current/Max Slots                                 | Get Slots                   | ❌           | ServerInformation(name=session)     | ❌           | ServerManager **            |
| Send Server/Welcome Message                           | Say                         | ❌           | SendServerMessage                   | ✅           | ServerManager  (TODO: MOVE) |
| Get Server Name                                       | Get Name                    | ❌           | ServerInformation(name=session)     | ❌           | ServerManager **            |
| List Players                                          | Get Players / Get PlayerIDs | ❌           | ServerInformation(name=players)     | ❌           | PlayerManager **            |
| Get Detailed Player Information                       | PlayerInfo                  | ❌           | ServerInformation(name=player)      | ❌           | PlayerManager **            |
| Message Player                                        | Message                     | ❌           | MessagePlayer                       | ❌           | PlayerManager **            |
| Punish Player                                         | Punish                      | ❌           | PunishPlayer                        | ❌           | PlayerManager **            |
| Kick                                                  | Kick                        | ❌           | Kick                                | ❌           | PlayerManager **            |
| Get Temporary Bans                                    | Get TempBans                | ❌           | N/A*                                | N/A*        | PlayerManager **            |
| Temporary Ban                                         | TempBan                     | ❌           | TempBan                             | ❌           | PlayerManager **            |
| Remove Temporary Ban                                  | PardonTempBan               | ❌           | RemoveTempBan                       | ❌           | PlayerManager **            |
| Get Permanent Bans                                    | Get PermaBans               | ❌           | N/A*                                | N/A*        | PlayerManager **            |
| Permanent Ban                                         | PermaBan                    | ❌           | PermanentBan                        | ❌           | PlayerManager **            |
| Remove Permanent Ban                                  | PardonPermaBan              | ❌           | RemovePermanentBan                  | ❌           | PlayerManager **            |
| Make Player Switch Team on Death                      | SwitchTeamOnDeath           | ❌           | N/A*                                | N/A*        | PlayerManager **            |
| Make Player Switch Team Immediately                   | SwitchTeamNow               | ❌           | N/A*                                | N/A*        | PlayerManager **            |
| Set Auto Balance Enabled                              | SetAutoBalanceEnabled       | ❌           | AutoBalance                         | ❌           | ServerManager **            |
| Get Auto Balance Enabled                              | Get AutoBalanceEnabled      | ❌           | N/A*                                | N/A*        | ServerManager **            |
| Set Auto Balance Threshold                            | SetAutoBalanceThreshold     | ❌           | AutoBalanceThreshold                | ❌           | ServerManager **            |
| Get Auto Balance Threshold                            | Get AutoBalanceThreshold    | ❌           | N/A*                                | N/A*        | ServerManager **            |
| Set Vote Kick Enabled                                 | SetVoteKickEnabled          | ❌           | VoteKickEnabled                     | ❌           | ServerManager **            |
| Get Vote Kick Enabled                                 | Get VoteKickEnabled         | ❌           | N/A*                                | N/A*        | ServerManager **            |
| Set Vote to Kick Threshold                            | SetVoteKickThreshold        | ❌           | VoteKickThreshold                   | ❌           | ServerManager **            |
| Get Vote to Kick Threshold                            | Get VoteKickThreshold       | ❌           | N/A*                                | N/A*        | ServerManager **            |
| Reset Vote to Kick Threshold                          | ResetVoteKickThreshold      | ❌           | ResetKickThreshold                  | ❌           | ServerManager **            |
| Get Profanities                                       | Get Profanity               | ❌           | N/A*                                | N/A*        | ProfanityManager **         |
| Add Profanities                                       | BanProfanity                | ❌           | N/A*                                | N/A*        | ProfanityManager **         |
| Remove Profanities                                    | UnbanProfanity              | ❌           | N/A*                                | N/A*        | ProfanityManager **         |
| Add VIP                                               | VipAdd                      | ❌           | N/A*                                | N/A*        | VIPManager **               |
| Remove VIP                                            | VipDel                      | ❌           | N/A*                                | N/A*        | VIPManager **               |
| Get VIPs                                              | Get vipids                  | ❌           | N/A*                                | N/A*        | VIPManager **               |
| Set VIP Slot Count                                    | SetNumVipSlots              | ❌           | N/A*                                | N/A*        | VIPManager **               |
| Get VIP Slot Count                                    | Get NumVipSlots             | ❌           | N/A*                                | N/A*        | VIPManager **               |
| Change RCON password                                  | RconPassword                | ❌           | N/A*                                | N/A*        | ServerManager **            |
| Displayable Commands                                  | Help                        | ❌           | DisplayableCommands                 | ❌           | RCONClientV2 **             |
| Client Reference Data                                 | **Help Command? **          | ❌           | ClientReferenceData                 | ❌           | RCONClientV2 **             |
| Admin Log                                             | ShowLog                     | ❌           | AdminLog                            | ❌           | LogManager **               |

*N/A\* Some methods supported by RCONv1 are not supported by RCONv2, and vice versa; \*\*Not yet implemented.*