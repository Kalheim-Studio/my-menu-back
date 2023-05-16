import type { Request } from "express";
import { Restaurant } from "../../../../Models/Restaurant";
import { logger } from "../../../../../Utils";

const validateAccount = async (req: Request) => {
    logger(__dirname, "Validating account");

    // Search for account to validate and update it
    const result = await Restaurant.updateOne({ validated: req.params.token }, { validated: "true" });

    if (result.modifiedCount === 0) {
        throw new Error("No account to validate have been found");
    }

    logger(__dirname, "Account Validated", { successMessage: "OK" });
};

export { validateAccount };
