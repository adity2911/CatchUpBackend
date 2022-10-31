const express = require("express");
const cors = require("cors");

const app = express();

const createMeet = require("./routes/createMeet/createMeet.router");
const verifyMeet = require("./routes/verifyMeet/verifyMeet.router");
const authRoute = require("./userAuth/routes/user");

app.use(cors({ origin: "http://localhost:8000" }));
app.use(express.json());

//comment kardiya bro
app.use("/createNew", createMeet);
app.use("/verify", verifyMeet);
app.use("/users", authRoute);

module.exports = app;
