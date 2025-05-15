const IRCONClient = require('./structures/IRCONClient');
const RCONClientV1 = require('./structures/v1/RCONClientV1');
const RCONClientV2 = require('./structures/v2/RCONClientV2');

const MessageV2 = require('./structures/v2/MessageV2');

module.exports = {
  IRCONClient,
  RCONClientV1,
  RCONClientV2,
  MessageV2
}