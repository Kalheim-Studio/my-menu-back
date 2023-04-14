import type { Server } from "socket.io";
import authenticate from "./Middlewares/authentication";
import { logger } from "../Utils/logger/logger";

const socket = (io: Server) => {
    authenticate(io);

    io.on("connection", (socket) => {
        logger("socket", "Socket connexion");

        // get restaurant id
        // Join restaurant id room
        socket.join("restaurantId");

        // Listening event
        // Change table state
        socket.on("tableState", (data) => {
            logger("socket", "Table state", { infoMessage: data.content });
            io.to("restaurantId").emit("message", {
                content: "Table State received",
                username: "MyMenu",
            });
        });
        // Waiter help table state
        socket.on("helpState", (data) => {
            logger("socket", "Table Waiter help state", { infoMessage: data.content });
            io.to("restaurantId").emit("message", {
                content: "Help State received",
                username: "MyMenu",
            });
        });
        // Launch order
        socket.on("launchOrder", (data) => {
            logger("socket", "Launch Order", { infoMessage: data.content });
            io.to("restaurantId").emit("message", {
                content: "Launch Order received",
                username: "MyMenu",
            });
        });
    });
};

export default socket;
