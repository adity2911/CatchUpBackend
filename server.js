const http = require("http");
const app = require("./app.js");
const PORT = process.env.PORT || 8000;

const connectToDataBase = require("./utils/mongo.js");
const connectToUserDataBase = require("./userAuth/mongo");

const server = http.createServer(app);

async function listenServer() {
  await connectToDataBase();
  await connectToUserDataBase();
  server.listen(PORT, () => {
    console.log(`listening on PORT: ${PORT}`);
  });
}
listenServer();
