const express = require("express");
const cors = require("cors");

const app = express();

const createMeet = require("./routes/createMeet/createMeet.router");
const verifyMeet = require("./routes/verifyMeet/verifyMeet.router");

app.use(cors({ origin: "http://localhost:8000" }));

app.use(express.json());

app.use("/createNew", createMeet);
app.use("/verify", verifyMeet);

module.exports = app;
