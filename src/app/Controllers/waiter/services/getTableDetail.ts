import type { Request } from "express";
import { logger } from "../../../../Utils/logger/logger";

const getTableDetail = async (req: Request) => {
    const message = "Table details - WIP";
    logger(__dirname, "Error", { errorMessage: message });
    throw new Error(message);
};

export default getTableDetail;
