import type { Request } from "express";
import { logger } from "../../../../Utils/logger/logger";

const orderItem = async (req: Request) => {
    const message = "Order Item - WIP";
    logger(__dirname, "Error", { errorMessage: message });
    throw new Error(message);
};

export default orderItem;
