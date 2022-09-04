const express = require("express");
const verifyMeet = require("./verifyMeet.controller");
const verifyMeetRouter = express.Router();

verifyMeetRouter.get("/:channelName", verifyMeet);

module.exports = verifyMeetRouter;
