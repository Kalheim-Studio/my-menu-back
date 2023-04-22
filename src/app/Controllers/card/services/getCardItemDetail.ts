import type { Request } from "express";
import { logger } from "../../../../Utils/logger/logger";

const getCardItemDetail = async (req: Request) => {
    const message = "get card item detail - WIP";
    logger(__dirname, "Error", { errorMessage: message });
    throw new Error(message);
};

export default getCardItemDetail;
