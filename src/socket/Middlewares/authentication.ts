import type { Server } from "socket.io";
import { logger } from "../../Utils/logger/logger";

const authenticate = (io: Server) => {
    logger("Socket authentication");
    io.use((socket, next) => {
        const { username } = socket.handshake.auth;
        logger("User connexion", username);
        next();
    });
};

export default authenticate;
