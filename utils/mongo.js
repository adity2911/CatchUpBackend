const mongoose = require("mongoose");
require("dotenv").config();

const mongoose_url = `mongodb+srv://Admin:${process.env.mongoPass}@catchupapp.yag6s19.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connection.once("open", () => {
  console.log("Mongoose Connection to MeetDatabase stablished");
});

mongoose.connection.on("error", (e) => {
  console.error(e);
});

async function connectToDataBase() {
  await mongoose.connect(mongoose_url);
}

module.exports = connectToDataBase;
