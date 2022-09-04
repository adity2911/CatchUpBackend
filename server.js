const http = require("http");
const app = require("./app.js");

const connectToDataBase = require("./utils/mongo.js");

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

async function listenServer() {
  await connectToDataBase();

  server.listen(PORT, () => {
    console.log(`listening on PORT: ${PORT}`);
  });
}
listenServer();
