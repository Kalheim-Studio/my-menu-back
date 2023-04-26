import type { Request } from "express";
import { logger } from "../../../../../Utils/logger/logger";

const resetPassword = (req: Request) => {
    // send mail
    const message = "Reset password - WIP";
    logger(__dirname, "Error", { errorMessage: message });
    throw new Error(message);
};

export default resetPassword;
