module.exports = (entry) => {
  let { timestamp: messageTimestamp, message } = entry;

  // *Some* lines have unescaped newline characters because of course they do, this escapes them.
  const escapeRegex = /\n(?!\[.+? \(\d+\)\])/g;
  message = message.replace(escapeRegex, "\\n");

  // Parses the header into its segments.
  // Example log header: [31:53 min (1747596221)] KILL
  // 31:53      -> \1
  // min        -> \2
  // 1747596221 -> \3
  // KILL       -> \4
  const headerRegExp = /^\[(\d*|\d*\.\d*|\d*:\d*|\d*:\d*:\d*) (ms|sec|min|hours) \((\d*)\)\] (CONNECTED|DISCONNECTED|KILL|TEAM KILL|MATCH START|MATCH ENDED|TEAMSWITCH|MESSAGE|BAN|KICK|Player|CHAT\[Team\]|CHAT\[Unit\]|VOTESYS)/;

  if (!headerRegExp.test(message))
    throw new Error(`Log has invalid header: ${message}`);

  let header, relativeTime, relativeTimeFormat, timestamp, logType;
  try {
    header = headerRegExp.exec(message);
    [relativeTime, relativeTimeFormat, timestamp, logType] = header.slice(1, 5);
  } catch {
    console.error(`Error parsing log: ${message}`);
    return {
      type: "parseError",
      message
    };
  }

  timestamp = Number(timestamp);

  switch (logType) {
    case "CONNECTED": {
      const playerConnectedRegExp = /CONNECTED (.*?) \((.*?)\)/;
      const [playerName, playerId] = playerConnectedRegExp.exec(message).slice(1, 3);

      return {
        type: "playerConnected",
        timestamp,
        playerId,
        playerName
      };
    }

    case "DISCONNECTED": {
      const playerDisconnectedRegExp = /DISCONNECTED (.*?) \((.*?)\)/;
      const [playerName, playerId] = playerDisconnectedRegExp.exec(message).slice(1, 3);

      return {
        type: "playerDisconnected",
        timestamp,
        playerId,
        playerName
      };
    }

    case "TEAMSWITCH": {
      const teamSwitchRegExp = /TEAMSWITCH (.*?) \((None|Allies|Axis) > (None|Allies|Axis)\)/;
      const [playerName, oldFaction, newFaction] = teamSwitchRegExp.exec(message).slice(1, 4);

      return {
        type: "playerSwitchFaction",
        timestamp,
        playerName,
        oldFaction,
        newFaction
      };
    }

    case "MATCH START": {
      const matchStartRegExp = /MATCH START (.*)/;
      const mapName = matchStartRegExp.exec(message)[1];

      return {
        type: "matchStart",
        timestamp,
        mapName
      };
    }

    case "MATCH ENDED": {
      const matchEndedRegExp = /`(.*?)` ALLIED \((\d) - (\d)\) AXIS/;
      const [mapName, alliesScore, axisScore] = matchEndedRegExp.exec(message).slice(1, 4);

      return {
        type: "matchEnded",
        timestamp,
        mapName,
        alliesScore: Number(alliesScore),
        axisScore: Number(axisScore)
      };

      break;
    }

    case "VOTESYS": {
      const voteStartedRegExp = /Player \[(.*?)\] Started a vote of type \((PVR_Kick_Abuse|PVR_Kick_Cheating)\) against \[(.*?)\]. VoteID: \[(\d*?)\]/;
      const voteCastRegExp = /VOTESYS: Player \[(.*?)\] voted \[(PV_Favour|PV_Ignored|PV_Against)\] for VoteID\[(\d*?)\]/;
      const voteExpiredRegExp = /VOTESYS: Vote \[(\d*?)\] expired before completion./;
      const prematurelyExpiredRegExp = /VOTESYS: Vote \[(\d*?)\] prematurely expired./;
      const voteCompletedRegExp = /VOTESYS: Vote \[(\d*?)\] completed. Result: (PVR_Passed|PVR_ExpiredOrCancelled)/;
      const votePassedRegExp = /VOTESYS: Vote Kick \{(.*?)\} successfully passed. \[For: (\d.*?)\/(\d.*?) - Against: (\d.*?)\]/;

      if (voteStartedRegExp.test(message)) {
        const res = voteStartedRegExp.exec(message);
        const [executorName, type, targetName, voteId] = res.slice(1, 5);

        return {
          type: "voteStarted",
          timestamp,
          voteId: Number(voteId),
          voteType: type,
          executorName,
          targetName
        };
      }

      if (voteCastRegExp.test(message)) {
        const res = voteCastRegExp.exec(message);
        const [playerName, action, voteId] = res.slice(1, 4);

        return {
          type: "voteCast",
          timestamp,
          voteId: Number(voteId),
          playerName,
          action
        };
      }

      if (voteExpiredRegExp.test(message)) {
        const voteId = voteExpiredRegExp.exec(message)[1];

        return {
          type: "voteExpiredBeforeCompletion",
          timestamp,
          voteId: Number(voteId)
        };
      }

      if (prematurelyExpiredRegExp.test(message)) {
        const voteId = prematurelyExpiredRegExp.exec(message)[1];

        return {
          type: "votePrematurelyExpired",
          timestamp,
          voteId: Number(voteId)
        };
      }

      if (voteCompletedRegExp.test(message)) {
        const res = voteCompletedRegExp.exec(message);
        const [voteId, result] = res.slice(1, 3);

        return {
          type: "voteCompleted",
          timestamp,
          voteId: Number(voteId),
          result
        };
      }

      if (votePassedRegExp.test(message)) {
        const res = votePassedRegExp.exec(message);
        const [playerName, forVotes, requiredVotes, againstVotes] = res.slice(1, 5);

        return {
          type: "votePassed",
          timestamp,
          playerName,
          forVotes: Number(forVotes),
          requiredVotes: Number(requiredVotes),
          againstVotes: Number(againstVotes)
        };
      }

      break;
    }

    case "KILL": {
      const playerKillRegExp = /KILL: (.*?)\((Axis|Allies)\/(.*?)\) -> (.*?)\((Axis|Allies)\/(.*?)\) with (.*)/;
      const [killerName, killerFaction, killerId, victimName, victimFaction, victimId, weapon] = playerKillRegExp.exec(message).slice(1, 10);

      return {
        type: "playerKilled",
        timestamp,
        killerName,
        killerFaction,
        killerId,
        victimName,
        victimFaction,
        victimId,
        weapon
      };
    }

    case "TEAM KILL": {
      const teamKillRegExp = /TEAM KILL: (.*?)\((Axis|Allies)\/(.*?)\) -> (.*?)\((Axis|Allies)\/(.*?)\) with (.*)/;
      const [killerName, killerFaction, killerId, victimName, victimFaction, victimId, weapon] = teamKillRegExp.exec(message).slice(1, 8);

      return {
        type: "playerTeamKilled",
        timestamp,
        killerName,
        killerFaction,
        killerId,
        victimName,
        victimFaction,
        victimId,
        weapon
      };
    }

    case "KICK": {
      const kickRegExp = /KICK: \[(.*?)\] has been kicked. \[(.*?)\]/;
      const [playerName, reason] = kickRegExp.exec(message).slice(1, 3);

      return {
        type: "playerKicked",
        timestamp,
        playerName,
        reason
      };
    }

    case "BAN": {
      const banRegExp = /BAN: \[(.*?)\] has been banned\. \[((PERMANENTLY BANNED|BANNED FOR ([,0-9]*?) HOURS) BY (VOTE|THE ADMINISTRATOR)!(?:\\n\\n(.*?))?)\]/;

      let [playerName, fullReason, banType, duration, customReason] = banRegExp.exec(message).slice(1, 6);

      duration = duration ? Number(duration.replaceAll(/,/g, "")) : null;

      return {
        type: "playerBanned",
        timestamp,
        temporary: !!duration,
        duration,
        playerName,
        fullReason,
        customReason
      };
    }

    case "MESSAGE": {
      const messageRegExp = /MESSAGE: player \[(.*?)\((.*?)\)\], content \[(.*)\]/;
      const [playerName, playerId, msg] = messageRegExp.exec(message).slice(1, 4);

      return {
        type: "message",
        timestamp,
        playerName,
        playerId,
        message: msg
      };
    }

    case "CHAT[Team]": {
      const teamChatRegExp = /CHAT\[Team\]\[(.*?)\((Axis|Allies)\/(.*?)\)\]: (.*)/;
      const [playerName, playerFaction, playerId, msg] = teamChatRegExp.exec(message).slice(1, 5);

      return {
        type: "teamChat",
        timestamp,
        playerName,
        playerId,
        playerFaction,
        message: msg
      };
    }

    case "CHAT[Unit]": {
      const unitChatRegExp = /CHAT\[Unit\]\[(.*?)\((Axis|Allies)\/(.*?)\)\]: (.*)/;
      const [playerName, playerFaction, playerId, msg] = unitChatRegExp.exec(message).slice(1, 5);

      return {
        type: "unitChat",
        timestamp,
        playerName,
        playerFaction,
        playerId,
        message: msg
      };
    }

    // For admin camera
    case "Player": {
      const adminCameraRegExp = /Player \[(.*?) \((.*?)\)\] (Entered Admin Camera|Left Admin Camera)/;
      const [playerName, playerId, msg] = adminCameraRegExp.exec(message).slice(1, 4);

      const action = msg === "Entered Admin Camera";

      return {
        type: action ? "playerEnteredAdminCamera" : "playerLeftAdminCamera",
        timestamp,
        playerId,
        playerName
      };
    }
  }

  return {
    type: "unknownLogType",
    message: message
  };
};