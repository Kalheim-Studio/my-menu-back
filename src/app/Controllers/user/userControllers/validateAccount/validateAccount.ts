import type { Request, Response } from "express";
import Restaurant from "../../../../Models/Restaurant";
import { logger } from "../../../../../Utils/logger/logger";

const validateAccount = (req: Request, res: Response) => {
    logger("validateAccount", "Validate account");

    // Search for account to validate and update it
    Restaurant.updateOne({ validated: req.params.token }, { validated: "true" }).then((result) => {
        if (result.modifiedCount > 0) {
            logger("validateAccount", "Account Validated", { successMessage: "OK" });
            res.status(200).send("Account has been validated");
        } else {
            logger("validateAccount", "Error", { errorMessage: "No account to validate have been found" });
            res.status(400).send("No account to validate have been found");
        }
    });
};

export default validateAccount;
