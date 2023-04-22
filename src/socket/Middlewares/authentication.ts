import type { Server } from "socket.io";
import { logger } from "../../Utils/logger/logger";

const authenticate = (io: Server) => {
    logger(__dirname, "Socket authentication");
    io.use((socket, next) => {
        const { username } = socket.handshake.auth;
        logger(__dirname, "User connexion", { infoMessage: username });
        next();
    });
};

export default authenticate;
