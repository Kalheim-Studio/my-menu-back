import type { Request } from "express";
import { logger } from "../../../../../Utils";

const getMenu = async (req: Request) => {
    const message = "Get Menu - WIP";
    logger(__dirname, "Error", { errorMessage: message });
    throw new Error(message);
};

export { getMenu };
