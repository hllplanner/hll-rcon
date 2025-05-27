const parseLogEntry = require("../lib/utils/parseLogEntry");

// Test different time formats in header
describe("Test Header Time Format Parsing", () => {
  test.each([
    ["[10:00:00 hours (1234)]", 1234],
    ["[30:00 min (1234)]", 1234],
    ["[15.03 sec (1234)]", 1234],
    ["[805 ms (1234)]", 1234]
  ])("parses %s correctly", (timeHeader, timestamp) => {
    const result = parseLogEntry({
      timestamp: 0, // this is unused in your current design
      message: `${timeHeader} CONNECTED PlayerName (123456)`
    });

    expect(result).toEqual({
      type: "playerConnected",
      timestamp,
      playerId: "123456",
      playerName: "PlayerName"
    });
  });
});

test("Parse Player Connect Logs", () => {
  const result = parseLogEntry({
    timestamp: 0,
    message: "[00:00 min (1234)] CONNECTED PlayerName (123456)"
  });

  expect(result).toEqual({
    type: "playerConnected",
    timestamp: 1234,
    playerId: "123456",
    playerName: "PlayerName"
  });
});

test("Parse Player Disconnect Logs", () => {
  const result = parseLogEntry({
    timestamp: 0,
    message: "[00:00 min (1234)] DISCONNECTED PlayerName (123456)"
  });

  expect(result).toEqual({
    type: "playerDisconnected",
    timestamp: 1234,
    playerId: "123456",
    playerName: "PlayerName"
  });
});

describe("Parse Player Switch Team Log", () => {
  test("Player Switches from None to Allies", () => {
    const result = parseLogEntry({
      timestamp: 0,
      message: "[00:00 min (1234)] TEAMSWITCH Player Name (None > Allies)"
    });

    expect(result).toEqual({
      type: "playerSwitchFaction",
      timestamp: 1234,
      playerName: "Player Name",
      oldFaction: "None",
      newFaction: "Allies"
    });
  });

  test("Player Switches from None to Axis", () => {
    const result = parseLogEntry({
      timestamp: 0,
      message: "[00:00 min (1234)] TEAMSWITCH Player Name (None > Axis)"
    });

    expect(result).toEqual({
      type: "playerSwitchFaction",
      timestamp: 1234,
      playerName: "Player Name",
      oldFaction: "None",
      newFaction: "Axis"
    });
  });

  test("Player Switches from Allies to Axis", () => {
    const result = parseLogEntry({
      timestamp: 0,
      message: "[00:00 min (1234)] TEAMSWITCH Player Name (Allies > Axis)"
    });

    expect(result).toEqual({
      type: "playerSwitchFaction",
      timestamp: 1234,
      playerName: "Player Name",
      oldFaction: "Allies",
      newFaction: "Axis"
    });
  });

  test("Player Switches from Axis to Allies", () => {
    const result = parseLogEntry({
      timestamp: 0,
      message: "[00:00 min (1234)] TEAMSWITCH Player Name (Axis > Allies)"
    });

    expect(result).toEqual({
      type: "playerSwitchFaction",
      timestamp: 1234,
      playerName: "Player Name",
      oldFaction: "Axis",
      newFaction: "Allies"
    });
  });
});

describe("Parse Match Start Logs", () => {
  test("SME Warfare", () => {
    const result = parseLogEntry({
      timestamp: 0,
      message: "[00:00 min (1234)] MATCH START SAINTE-MÈRE-ÉGLISE Warfare"
    });

    expect(result).toEqual({
      type: "matchStart",
      timestamp: 1234,
      mapName: "SAINTE-MÈRE-ÉGLISE Warfare"
    });
  });

  test("Stalingrad Warfare", () => {
    const result = parseLogEntry({
      timestamp: 0,
      message: "[00:00 min (1234)] MATCH START STALINGRAD Warfare"
    });

    expect(result).toEqual({
      type: "matchStart",
      timestamp: 1234,
      mapName: "STALINGRAD Warfare"
    });
  });
});

test("Parse Match End Logs", () => {
  const result = parseLogEntry({
    timestamp: 0,
    message: "[00:00 min (1234)] MATCH ENDED `UTAH BEACH Warfare` ALLIED (3 - 2) AXIS "
  });

  expect(result).toEqual({
    type: "matchEnded",
    timestamp: 1234,
    mapName: "UTAH BEACH Warfare",
    alliesScore: 3,
    axisScore: 2
  });
});

//
describe("Validate Vote Logs", () => {
  test("Start Kick For Abuse", () => {
    const result = parseLogEntry({
      timestamp: 0,
      message: "[00:00 min (1234)] VOTESYS: Player [Player Name 1] Started a vote of type (PVR_Kick_Abuse) against [Player Name 2]. VoteID: [1]"
    });

    expect(result).toEqual({
      type: "voteStarted",
      timestamp: 1234,
      voteId: 1,
      voteType: "PVR_Kick_Abuse",
      executorName: "Player Name 1",
      targetName: "Player Name 2"
    });
  });

  test("Start Kick For Cheating", () => {
    const result = parseLogEntry({
      timestamp: 0,
      message: "[00:00 min (1234)] VOTESYS: Player [Player Name 1] Started a vote of type (PVR_Kick_Cheating) against [Player Name 2]. VoteID: [2]"
    });

    expect(result).toEqual({
      type: "voteStarted",
      timestamp: 1234,
      voteId: 2,
      voteType: "PVR_Kick_Cheating",
      executorName: "Player Name 1",
      targetName: "Player Name 2"
    });
  });

  test("Vote in Favor of", () => {
    const result = parseLogEntry({
      timestamp: 0,
      message: "[00:00 min (1234)] VOTESYS: Player [Player Name] voted [PV_Favour] for VoteID[1]"
    });

    expect(result).toEqual({
      type: "voteCast",
      timestamp: 1234,
      voteId: 1,
      playerName: "Player Name",
      action: "PV_Favour"
    });
  });

  test("Vote Against", () => {
    const result = parseLogEntry({
      timestamp: 0,
      message: "[00:00 min (1234)] VOTESYS: Player [Player Name] voted [PV_Against] for VoteID[1]"
    });

    expect(result).toEqual({
      type: "voteCast",
      timestamp: 1234,
      voteId: 1,
      playerName: "Player Name",
      action: "PV_Against"
    });
  });

  test("Ignored Vote", () => {
    const result = parseLogEntry({
      timestamp: 0,
      message: "[00:00 min (1234)] VOTESYS: Player [Player Name] voted [PV_Ignored] for VoteID[1]"
    });

    expect(result).toEqual({
      type: "voteCast",
      timestamp: 1234,
      voteId: 1,
      playerName: "Player Name",
      action: "PV_Ignored"
    });
  });

  test("Vote Expired Before Completion", () => {
    const result = parseLogEntry({
      timestamp: 0,
      message: "[00:00 min (1234)] VOTESYS: Vote [2] expired before completion."
    });

    expect(result).toEqual({
      type: "voteExpiredBeforeCompletion",
      timestamp: 1234,
      voteId: 2
    });
  });

  test("Vote Prematurely Expired", () => {
    const result = parseLogEntry({
      timestamp: 0,
      message: "[00:00 min (1234)] VOTESYS: Vote [3] prematurely expired."
    });

    expect(result).toEqual({
      type: "votePrematurelyExpired",
      timestamp: 1234,
      voteId: 3
    });
  });

  describe("Vote Completed", () => {
    test("Vote Passed", () => {
      const result = parseLogEntry({
        timestamp: 0,
        message: "[00:00 min (1234)] VOTESYS: Vote [1] completed. Result: PVR_Passed"
      });

      expect(result).toEqual({
        type: "voteCompleted",
        timestamp: 1234,
        voteId: 1,
        result: "PVR_Passed"
      });
    });

    test("Vote Expired or Canceled", () => {
      const result = parseLogEntry({
        timestamp: 0,
        message: "[00:00 min (1234)] VOTESYS: Vote [2] completed. Result: PVR_ExpiredOrCancelled"
      });

      expect(result).toEqual({
        type: "voteCompleted",
        timestamp: 1234,
        voteId: 2,
        result: "PVR_ExpiredOrCancelled"
      });
    });
  });

  test("Vote Passed", () => {
    const result = parseLogEntry({
      timestamp: 0,
      message: "[00:00 min (1234)] VOTESYS: Vote Kick {Player Name} successfully passed. [For: 2/1 - Against: 0]"
    });

    expect(result).toEqual({
      type: "votePassed",
      timestamp: 1234,
      playerName: "Player Name",
      forVotes: 2,
      requiredVotes: 1,
      againstVotes: 0
    });
  });
});

describe("Validate Kill Logs", () => {
  test("Kill Test 1", () => {
    const result = parseLogEntry({
      timestamp: 0,
      message: "[00:00 min (1234)] KILL: Player1 Name(Axis/Player1Id) -> Player2 Name(Allies/Player2Id) with KARABINER 98K"
    });

    expect(result).toEqual({
      type: "playerKilled",
      timestamp: 1234,
      killerName: "Player1 Name",
      killerId: "Player1Id",
      killerFaction: "Axis",
      victimName: "Player2 Name",
      victimId: "Player2Id",
      victimFaction: "Allies",
      weapon: "KARABINER 98K"
    });
  });

  test("Kill Test 2", () => {
    const result = parseLogEntry({
      timestamp: 0,
      message: "[00:00 min (1234)] KILL: Player 1 Name (Allies/PLAYER 1 ID) -> Player 2 Name (Axis/Player 2 ID ) with imaginaryWeapon"
    });

    expect(result).toEqual({
      type: "playerKilled",
      timestamp: 1234,
      killerName: "Player 1 Name ",
      killerId: "PLAYER 1 ID",
      killerFaction: "Allies",
      victimName: "Player 2 Name ",
      victimId: "Player 2 ID ",
      victimFaction: "Axis",
      weapon: "imaginaryWeapon"
    });
  });

  test("Teamkill Test 1", () => {
    const result = parseLogEntry({
      timestamp: 0,
      message: "[00:00 min (1234)] TEAM KILL: Player1 Name(Axis/Player1Id) -> Player2 Name(Allies/Player2Id) with KARABINER 98K"
    });

    expect(result).toEqual({
      type: "playerTeamKilled",
      timestamp: 1234,
      killerName: "Player1 Name",
      killerId: "Player1Id",
      killerFaction: "Axis",
      victimName: "Player2 Name",
      victimId: "Player2Id",
      victimFaction: "Allies",
      weapon: "KARABINER 98K"
    });
  });

  test("Teamkill Test 2", () => {
    const result = parseLogEntry({
      timestamp: 0,
      message: "[00:00 min (1234)] TEAM KILL: Player 1 Name (Allies/PLAYER 1 ID) -> Player 2 Name (Axis/Player 2 ID ) with imaginaryWeapon"
    });

    expect(result).toEqual({
      type: "playerTeamKilled",
      timestamp: 1234,
      killerName: "Player 1 Name ",
      killerId: "PLAYER 1 ID",
      killerFaction: "Allies",
      victimName: "Player 2 Name ",
      victimId: "Player 2 ID ",
      victimFaction: "Axis",
      weapon: "imaginaryWeapon"
    });
  });
});

describe("Validate Kick Logs", () => {
  test("Without a Reason.", () => {
    const result = parseLogEntry({
      timestamp: 0,
      message: "[00:00 min (1234)] KICK: [Player Name] has been kicked. [KICKED BY THE ADMINISTRATOR!]"
    });

    expect(result).toEqual({
      type: "playerKicked",
      timestamp: 1234,
      playerName: "Player Name",
      reason: "KICKED BY THE ADMINISTRATOR!"
    });
  });

  test("With a Reason.", () => {
    const result = parseLogEntry({
      timestamp: 0,
      message: "[00:00 min (1234)] KICK: [Player Name] has been kicked. [KICKED BY THE ADMINISTRATOR!\\n\\ntest reason]"
    });

    expect(result).toEqual({
      type: "playerKicked",
      timestamp: 1234,
      playerName: "Player Name",
      reason: "KICKED BY THE ADMINISTRATOR!\\n\\ntest reason"
    });
  });
});

describe("Validate Ban Logs", () => {
  test("PermaBan Without a Reason.", () => {
    const result = parseLogEntry({
      timestamp: 0,
      message: "[00:00 min (1234)] BAN: [Player Name] has been banned. [PERMANENTLY BANNED BY THE ADMINISTRATOR!]"
    });

    expect(result).toEqual({
      type: "playerBanned",
      timestamp: 1234,
      playerName: "Player Name",
      fullReason: "PERMANENTLY BANNED BY THE ADMINISTRATOR!",
      customReason: undefined,
      bannedBy: "THE ADMINISTRATOR",
      temporary: false,
      duration: null
    });
  });

  test("PermaBan With a Reason.", () => {
    const result = parseLogEntry({
      timestamp: 0,
      message: "[00:00 min (1234)] BAN: [Player Name] has been banned. [PERMANENTLY BANNED BY THE ADMINISTRATOR!\\n\\nreason1 reason2]"
    });

    expect(result).toEqual({
      type: "playerBanned",
      timestamp: 1234,
      playerName: "Player Name",
      fullReason: "PERMANENTLY BANNED BY THE ADMINISTRATOR!\\n\\nreason1 reason2",
      customReason: "reason1 reason2",
      bannedBy: "THE ADMINISTRATOR",
      temporary: false,
      duration: null
    });
  });

  test("Temporary Ban Without a Reason.", () => {
    const result = parseLogEntry({
      timestamp: 0,
      message: "[00:00 min (1234)] BAN: [Player Name] has been banned. [BANNED FOR 1 HOURS BY THE ADMINISTRATOR!]"
    });

    expect(result).toEqual({
      type: "playerBanned",
      timestamp: 1234,
      playerName: "Player Name",
      fullReason: "BANNED FOR 1 HOURS BY THE ADMINISTRATOR!",
      bannedBy: "THE ADMINISTRATOR",
      customReason: undefined,
      temporary: true,
      duration: 1
    });
  });

  test("Temporary Ban With a Reason.", () => {
    const result = parseLogEntry({
      timestamp: 0,
      message: "[00:00 min (1234)] BAN: [Player Name] has been banned. [BANNED FOR 1 HOURS BY THE ADMINISTRATOR!\\n\\ntest reason]"
    });

    expect(result).toEqual({
      type: "playerBanned",
      timestamp: 1234,
      playerName: "Player Name",
      fullReason: "BANNED FOR 1 HOURS BY THE ADMINISTRATOR!\\n\\ntest reason",
      bannedBy: "THE ADMINISTRATOR",
      customReason: "test reason",
      temporary: true,
      duration: 1
    });
  });

  test("Temporary Ban with duration >999 hours.", () => {
    const result = parseLogEntry({
      timestamp: 0,
      message: "[00:00 min (1234)] BAN: [Player Name] has been banned. [BANNED FOR 1,234 HOURS BY THE ADMINISTRATOR!]"
    });

    expect(result).toEqual({
      type: "playerBanned",
      timestamp: 1234,
      playerName: "Player Name",
      fullReason: "BANNED FOR 1,234 HOURS BY THE ADMINISTRATOR!",
      customReason: undefined,
      bannedBy: "THE ADMINISTRATOR",
      temporary: true,
      duration: 1234
    });
  });
});

test("Validate Team Chat Log", () => {
  const result = parseLogEntry({
    timestamp: 0,
    message: "[00:00 min (1234)] CHAT[Team][Player Name(Axis/Player ID)]: message"
  });

  expect(result).toEqual({
    type: "teamChat",
    timestamp: 1234,
    playerName: "Player Name",
    playerId: "Player ID",
    playerFaction: "Axis",
    message: "message"
  });
});

test("Validate Unit Chat Log", () => {
  const result = parseLogEntry({
    timestamp: 0,
    message: "[00:00 min (1234)] CHAT[Unit][Player Name(Axis/Player ID)]: message"
  });

  expect(result).toEqual({
    type: "unitChat",
    timestamp: 1234,
    playerName: "Player Name",
    playerId: "Player ID",
    playerFaction: "Axis",
    message: "message"
  });
});

test("Player Entered Admin Camera", () => {
  const result = parseLogEntry({
    timestamp: 0,
    message: "[00:00 min (1234)] Player [Player Name (Player ID)] Entered Admin Camera"
  });

  expect(result).toEqual({
    type: "playerEnteredAdminCamera",
    timestamp: 1234,
    playerName: "Player Name",
    playerId: "Player ID"
  });
});

test("Player Left Admin Camera", () => {
  const result = parseLogEntry({
    timestamp: 0,
    message: "[00:00 min (1234)] Player [Player Name (Player ID)] Left Admin Camera"
  });

  expect(result).toEqual({
    type: "playerLeftAdminCamera",
    timestamp: 1234,
    playerName: "Player Name",
    playerId: "Player ID"
  });
});