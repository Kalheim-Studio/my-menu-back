const http = require("http");
const app = require("./app");
require("dotenv").config();

// Create server
const server = http.createServer(app);
// Execution port environment variable
const PORT = parseInt(process.env.PORT) || 3000;

// Server start
server.listen(PORT);

// On server start
server.on("listening", () => {
  console.log("Server start on port: " + PORT);
});

// On server error
server.on("error", (err) =>
  console.error("An error occured at server start.", err)
);
