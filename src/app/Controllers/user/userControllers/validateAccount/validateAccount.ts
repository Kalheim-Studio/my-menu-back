import type { Request, Response } from "express";
import Restaurant from "../../../../Models/Restaurant";
import { logger } from "../../../../../Utils/logger/logger";

const validateAccount = (req: Request, res: Response) => {
    logger("Validate account");
    
    // Search for account to validate and update it
    Restaurant.updateOne({ validated: req.params.token }, { validated: "true" }).then((result) => {
        if (result.modifiedCount > 0) {
            logger("Validate account.");
            res.status(200).send("Account has been validated");
        } else res.status(400).send("No account to validate have been found");
    });
};

export default validateAccount;
