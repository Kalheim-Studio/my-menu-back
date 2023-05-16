import type { Request } from "express";
import { logger } from "../../../../../Utils";

const changePassword = (req: Request) => {
    // verif token
    const message = "Change password - WIP";
    logger(__dirname, "Error", { errorMessage: message });
    throw new Error(message);
};

export { changePassword };
