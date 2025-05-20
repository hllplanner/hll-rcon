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
    const headerRegExp = /^\[(\d*|\d*\.\d*|\d*:\d*|\d*:\d*:\d*) (ms|sec|min|hours) \((\d*)\)\] (CONNECTED|DISCONNECTED|KILL|TEAM KILL|MATCH START|MATCH ENDED|TEAMSWITCH|MESSAGE|BAN|KICK|Player|CHAT\[Team\]|CHAT\[Unit\])/g;
    const header = headerRegExp.exec(message);
    const [relativeTime, relativeTimeFormat, timestamp, logType] = header.slice(1, 5);

    switch (logType) {
      case "CONNECTED": {
        const playerConnectedRegExp = /CONNECTED (.*?) \((.*?)\)/g;
        const [playerName, playerId] = playerConnectedRegExp.exec(message).slice(1, 3);

        return {
          type: "playerConnected",
          timestamp,
          playerId,
          playerName
        };
      }

      case "DISCONNECTED": {
        const playerDisconnectedRegExp = /DISCONNECTED (.*?) \((.*?)\)/g;
        const [playerName, playerId] = playerDisconnectedRegExp.exec(message).slice(1, 3);

        return {
          type: "playerDisconnected",
          timestamp,
          playerId,
          playerName
        };
      }

      case "TEAMSWITCH": {
        const teamSwitchRegExp = /TEAMSWITCH (.*?) \((None|Allies|Axis) > (None|Allies|Axis)\)/g;
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
        const matchStartRegExp = /MATCH START (.*)/g;
        const [mapName] = matchStartRegExp.exec(message);

        return {
          type: "matchStart",
          timestamp,
          mapName
        };
      }

      case "MATCH ENDED": {
        const matchEndedRegExp = /`(.*?)` ALLIED \((\d) - (\d)\) AXIS/g;
        const [mapName, alliesScore, axisScore] = matchEndedRegExp.exec(message).slice(1, 4);

        return {
          type: "matchEnded",
          timestamp,
          mapName,
          alliesScore,
          axisScore
        };

        break;
      }

      case "KILL": {
        const playerKillRegExp = /KILL: (.*?)\((Axis|Allies)\/(.*?)\) -> (.*?)\((Axis|Allies)\/(.*?)\) with (.*)/g;
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
        const teamKillRegExp = /TEAM KILL: (.*?)\((Axis|Allies)\/(.*?)\) -> (.*?)\((Axis|Allies)\/(.*?)\) with (.*)/g;
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
        const kickRegExp = /KICK: \[(.*?)\] has been kicked. \[(.*?)\]/g;
        const [playerName, reason] = kickRegExp.exec(message).slice(1, 3);

        return {
          type: "playerKicked",
          timestamp,
          playerName
        };
      }

      case "BAN": {
        const banRegExp = /BAN: \[(.*?)\] has been banned\. \[(?:PERMANENTLY BANNED|BANNED FOR ([,0-9]*?) HOURS) BY THE ADMINISTRATOR!(?:\\n\\n(.*?))?\]/g;

        let [playerName, duration, reason] = banRegExp.exec(message).slice(1, 4);

        duration = duration ? Number(duration.replaceAll(/,/g, "")) : null;

        return {
          type: "playerBanned",
          timestamp,
          temporary: !!duration,
          duration,
          playerName,
          reason
        };
      }

      case "MESSAGE": {
        const messageRegExp = /MESSAGE: player \[(.*?)\((.*?)\)\], content \[(.*)\]/g;
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
        const teamChatRegExp = /CHAT\[Team\]\[(.*?)\((Axis|Allies)\/(.*?)\)\]: (.*)/g;
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
        const unitChatRegExp = /CHAT\[Unit\]\[(.*?)\((Axis|Allies)\/(.*?)\)\]: (.*)/g;
        const [playerName, playerFaction, playerId, msg] = unitChatRegExp.exec(message).slice(1, 5);

        return {
          type: "unitChat",
          timestamp,
          playerName,
          playerFaction,
          playerId,
          msg
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

}