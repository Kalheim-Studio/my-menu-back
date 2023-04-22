import type { Request } from "express";
import { logger } from "../../../../Utils/logger/logger";

const getOrderInfo = async (req: Request) => {
    const message = "Get order info - WIP";
    logger(__dirname, "Error", { errorMessage: message });
    throw new Error(message);
};

export default getOrderInfo;
