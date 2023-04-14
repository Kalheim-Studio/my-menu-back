import type { Server } from "socket.io";
import { logger } from "../../Utils/logger/logger";

const authenticate = (io: Server) => {
    logger("socketAuthentication", "Socket authentication");
    io.use((socket, next) => {
        const { username } = socket.handshake.auth;
        logger("socket authentication", "User connexion", { infoMessage: username });
        next();
    });
};

export default authenticate;
