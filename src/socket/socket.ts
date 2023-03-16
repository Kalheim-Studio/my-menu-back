import type { Server } from "socket.io";
import authenticate from "./Middlewares/authentication";

const socket = (io: Server) => {
  authenticate(io);

  io.on("connection", (socket) => {
    console.log("Socket connexion");

    // get restaurant id
    // Join restaurant id room
    socket.join("restaurantId");

    // Listening event
    // Change table state
    socket.on("tableState", (data) => {
      console.log("Table state - " + data.content);
      io.to("restaurantId").emit("message", {
        content: "Table State received",
        username: "MyMenu",
      });
    });
    // Waiter help table state
    socket.on("helpState", (data) => {
      console.log("Table Waiter help state - " + data.content);
      io.to("restaurantId").emit("message", {
        content: "Help State received",
        username: "MyMenu",
      });
    });
    // Launch order
    socket.on("launchOrder", (data) => {
      console.log("Launch Order - " + data.content);
      io.to("restaurantId").emit("message", {
        content: "Launch Order received",
        username: "MyMenu",
      });
    });
  });
};

export default socket;
