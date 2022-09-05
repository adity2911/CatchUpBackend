const mongoose = require("mongoose");
require("dotenv").config();

const uri = `mongodb+srv://${process.env.USER_ID}:${process.env.PASSWORD}@catchupapp.yag6s19.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connection.once("open", () => {
  console.log("Mongoose Connection to User Database stablished");
});

mongoose.connection.on("error", (e) => {
  console.error(e);
});

async function connectToDataBase() {
  await mongoose.connect(uri);
}

module.exports = connectToDataBase;
