import type { Request } from "express";
import { logger } from "../../../../Utils/logger/logger";

const getAccountInfo = async (req: Request) => {
    const message = "Get account info - WIP";
    logger(__dirname, "Error", { errorMessage: message });
    throw new Error(message);
};

export default getAccountInfo;
