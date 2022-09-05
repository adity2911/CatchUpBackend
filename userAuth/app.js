const express = require("express");
const passport = require("passport");

const app = express();

const authRoute = require("./routes/user");

app.use(express.json());
app.use(passport.initialize());
app.use("/users", authRoute);

module.exports = app;
