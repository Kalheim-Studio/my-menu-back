import type { Request } from "express";
import { logger } from "../../../../Utils/logger/logger";

const createCardItem = async (req: Request) => {
    const message = "Create Card item - WIP";
    logger(__dirname, "Error", { errorMessage: message });
    throw new Error(message);
};

export default createCardItem;
