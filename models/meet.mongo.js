const mongoose = require("mongoose");

const meetSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  channelName: {
    type: String,
    required: true,
  },
  meetId: {
    type: Number,
  },
});

module.exports = mongoose.model("meets", meetSchema);
/* 
This for Hacktober Fest 2022
*/
