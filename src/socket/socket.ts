import type { Server } from "socket.io";
import authenticate from "./Middlewares/authentication";
import { logger } from "../Utils";

const socket = (io: Server) => {
    authenticate(io);

    io.on("connection", (socket) => {
        logger(__dirname, "Socket connexion");

        // get restaurant id
        // Join restaurant id room
        socket.join("restaurantId");

        // Listening event
        // Change table state
        socket.on("tableState", (data) => {
            logger(__dirname, "Table state", { infoMessage: data.content });
            io.to("restaurantId").emit("message", {
                content: "Table State received",
                username: "MyMenu",
            });
        });
        // Waiter help table state
        socket.on("helpState", (data) => {
            logger(__dirname, "Table Waiter help state", { infoMessage: data.content });
            io.to("restaurantId").emit("message", {
                content: "Help State received",
                username: "MyMenu",
            });
        });
        // Launch order
        socket.on("launchOrder", (data) => {
            logger(__dirname, "Launch Order", { infoMessage: data.content });
            io.to("restaurantId").emit("message", {
                content: "Launch Order received",
                username: "MyMenu",
            });
        });
    });
};

export default socket;
