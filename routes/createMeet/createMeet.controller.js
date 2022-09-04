const { RtcTokenBuilder, RtcRole } = require("agora-access-token");
const meetDatabase = require("../../models/meet.mongo");
var randomstring = require("randomstring");

require("dotenv").config();

const config = {
  APP_ID: process.env.APP_ID,
  APP_CERTIFICATE: process.env.APP_CERTIFICATE,
};

const nocache = (req, resp, next) => {
  resp.header("cache-control", "private, no-cache, no-store, must-revalidate");
  resp.header("Expires", "-1");
  resp.header("Pragma", "no-cache");
  next();
};

async function createMeet(req, resp) {
  // set response header
  resp.header("Access-Control-Allow-Origin", "*");
  // get channel name
  const channelName = randomstring.generate(7);
  if (!channelName) {
    return resp.status(500).json({ error: "channel is required" });
  }
  // get uid
  let uid = req.query.uid;
  if (!uid || uid == " ") {
    uid = 0;
  }
  // get role
  let role = RtcRole.SUBSCRIBER;
  if (req.query.role == "publisher") {
    role = RtcRole.PUBLISHER;
  }
  // get the expire time
  let expireTime = req.query.expireTime;
  if (!expireTime || expireTime == " ") {
    expireTime = 3600;
  } else {
    expireTime = parseInt(expireTime, 10);
  }
  const currentTime = Math.floor(Date.now() / 1000);
  const privilegeExpireTime = currentTime + expireTime;

  const token = RtcTokenBuilder.buildTokenWithUid(
    config.APP_ID,
    config.APP_CERTIFICATE,
    channelName,
    uid,
    role,
    privilegeExpireTime
  );

  let currentMeetId = await getLatestMeetId();

  let newMeet = {
    token: token,
    channelName: channelName,
    meetId: currentMeetId,
  };

  try {
    await meetDatabase.create(newMeet);
  } catch (e) {
    console.error(e);
  }

  return resp.json({ token: token, channelName: channelName });
}

async function getLatestMeetId() {
  const number = await meetDatabase.findOne().sort("-meetId");
  if (!number) {
    return 1; //default
  }
  return number.meetId + 1;
}

module.exports = { createMeet, nocache };
