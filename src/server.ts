import http from "http";
import app from "./app/app";
import dotenv from "dotenv";
import { Server } from "socket.io";
import socket from "./socket/socket";
import mongoose from "mongoose";
import { logger } from "./Utils/logger/logger";

// Initializing environnment
dotenv.config();

// Create server
const server = http.createServer(app);
// Execution port environment variable
const PORT = parseInt(process.env.PORT || "8080");

// Server start
server.listen(PORT);

// Websocket
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

// Connection to database
mongoose
    .connect(String(process.env.DATABASE_URI))
    .then(() => logger(__dirname, "Connection to database", { successMessage: "OK" }))
    .catch((err) => logger(__dirname, "Error on database connection.", { errorMessage: err.message }));

// On server start
server.on("listening", () => {
    logger(__dirname, "Server start", { infoMessage: "Port: " + PORT });
    socket(io);
});

// On server error
server.on("error", (err) => logger("server", "An error occured at server start.", { errorMessage: err.message }));
