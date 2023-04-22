import type { Request } from "express";
import { logger } from "../../../../Utils/logger/logger";

const createMenu = async (req: Request) => {
    const message = "Create Menu - WIP";
    logger(__dirname, "Error", { errorMessage: message });
    throw new Error(message);
};

export default createMenu;
