import http from "http";
import app from "./app/app";
import dotenv from "dotenv";
import { Server } from "socket.io";
import socket from "./socket/socket";
import mongoose from "mongoose";
import { MongoClient, ServerApiVersion } from "mongodb";

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
    .then(() => console.log("Connection to database: OK."))
    .catch((err) => console.log("Error on database connection.", err));

// On server start
server.on("listening", () => {
    console.log("Server start on port: " + PORT);
    socket(io);
});

// On server error
server.on("error", (err) => console.error("An error occured at server start.", err));
