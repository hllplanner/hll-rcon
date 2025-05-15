const IRCONClient = require('./structures/IRCONClient');
const RCONClientV1 = require('./structures/v1/RCONClientV1');
const RCONClientV2 = require('./structures/v2/RCONClientV2');

const RequestMessage = require('./structures/v2/RequestMessage');
const ResponseMessage = require('./structures/v2/ResponseMessage');

const XOR = require('./utils/XOR');
const intoQuotes = require('./utils/intoQuotes');

module.exports = {
  IRCONClient,
  RCONClientV1,
  RCONClientV2,

  RequestMessage,
  ResponseMessage,

  XOR,
  intoQuotes
}