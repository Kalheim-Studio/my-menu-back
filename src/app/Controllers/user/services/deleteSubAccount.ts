import type { Request } from "express";
import { logger } from "../../../../Utils/logger/logger";

const deleteSubAccount = async (req: Request) => {
    const message = "Deleting account - WIP";
    logger(__dirname, "Error", { errorMessage: message });
    throw new Error(message);
};

export default deleteSubAccount;
