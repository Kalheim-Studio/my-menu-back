import type { Request } from "express";
import { Restaurant } from "../../../../Models/Restaurant";
import { logger } from "../../../../../Utils/logger/logger";

const validateAccount = async (req: Request) => {
    logger(__dirname, "Validating account");

    // Search for account to validate and update it
    const result = await Restaurant.updateOne({ validated: req.params.token }, { validated: "true" });

    if (result.modifiedCount > 0) {
        logger(__dirname, "Account Validated", { successMessage: "OK" });
    } else {
        logger(__dirname, "Error", { errorMessage: "No account to validate have been found" });
        throw new Error("No account to validate have been found");
    }
};

export default validateAccount;
