const meetDatabase = require("../../models/meet.mongo");

async function verifyMeet(req, res) {
  let channelName = String(req.params.channelName);
  const data = await meetDatabase.find({ channelName: channelName });
  return res.json({ "token ": data[0].token });
}

module.exports = verifyMeet;
