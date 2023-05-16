import type { Request } from "express";
import { logger } from "../../../../../Utils";

const createMenuItem = async (req: Request) => {
    const message = "Create Menu item - WIP";
    logger(__dirname, "Error", { errorMessage: message });
    throw new Error(message);
};

export { createMenuItem };
