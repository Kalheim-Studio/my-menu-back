import type { Server } from "socket.io";

const authenticate = (io: Server) => {
  console.log("Authentication");
  io.use((socket, next) => {
    const { username } = socket.handshake.auth;
    console.log("Welcome " + username);
    next();
  });
};

export default authenticate;
