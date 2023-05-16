import type { Request } from "express";
import { logger } from "../../../../../Utils";

const getMenuItemDetail = async (req: Request) => {
    const message = "get menu item detail - WIP";
    logger(__dirname, "Error", { errorMessage: message });
    throw new Error(message);
};

export { getMenuItemDetail };
