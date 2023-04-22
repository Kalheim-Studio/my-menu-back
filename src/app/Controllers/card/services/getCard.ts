import type { Request } from "express";
import { logger } from "../../../../Utils/logger/logger";

const getCard = async (req: Request) => {
    const message = "Get Card - WIP";
    logger(__dirname, "Error", { errorMessage: message });
    throw new Error(message);
};

export default getCard;
