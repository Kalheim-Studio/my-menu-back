import http from "http";
import app from "./app/app";
import dotenv from "dotenv";

// Initializing environnment
dotenv.config();

// Create server
const server = http.createServer(app);
// Execution port environment variable
const PORT = parseInt(process.env.PORT || "8080");

// Server start
server.listen(PORT);

// On server start
server.on("listening", () => {
    console.log("Server start on port: " + PORT);
});

// On server error
server.on("error", (err) => console.error("An error occured at server start.", err));
