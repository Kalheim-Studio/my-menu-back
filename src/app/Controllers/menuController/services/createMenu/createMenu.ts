import type { Request } from "express";
import { logger } from "../../../../../Utils";

const createMenu = async (req: Request) => {
    const message = "Create Menu - WIP";
    logger(__dirname, "Error", { errorMessage: message });
    throw new Error(message);
};

export { createMenu };
