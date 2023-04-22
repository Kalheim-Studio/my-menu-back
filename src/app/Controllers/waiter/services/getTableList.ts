import type { Request } from "express";
import { logger } from "../../../../Utils/logger/logger";

const getTableList = async (req: Request) => {
    const message = "Get table list - WIP";
    logger(__dirname, "Error", { errorMessage: message });
    throw new Error(message);
};

export default getTableList;
