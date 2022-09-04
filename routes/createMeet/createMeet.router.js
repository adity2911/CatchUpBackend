const express = require("express");
const { createMeet, nocache } = require("./createMeet.controller");

const createMeetRouter = express.Router();

// createMeetRouter.post("/", createMeet);
createMeetRouter.get("/", nocache, createMeet);

module.exports = createMeetRouter;
