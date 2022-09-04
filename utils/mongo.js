const mongoose = require("mongoose");
require("dotenv").config();

const mongoPass = process.env.mongoPass;
const mongoose_url = `mongodb+srv://Admin:${mongoPass}@catchupapp.yag6s19.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connection.once("open", () => {
  console.log("Mongoose Connection stablished");
});

mongoose.connection.on("error", (e) => {
  console.error(e);
});

async function connectToDataBase() {
  await mongoose.connect(mongoose_url);
}

module.exports = connectToDataBase;
