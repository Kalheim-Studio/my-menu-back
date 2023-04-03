import type { Request, Response } from "express";
import Restaurant from "../../../../Models/Restaurant";
import { logger } from "../../../../../Utils/logger/logger";

const validateAccount = (req: Request, res: Response) => {
    logger("Validate account");

    // Search for account to validate
    Restaurant.findOne({ validated: req.params.token })
        .then(async (result) => {
            if (result) {
                logger("Validate account.", result.email);
                // Update account
                await Restaurant.updateOne({ validated: req.params.token }, { validated: "true" });
                res.status(200).send("Account has been validated");
            } else {
                logger("Account already validated");
                res.status(400).send("Account has already been validated");
            }
        })
        .catch((err) => {
            logger("Error", err.message);
            res.status(400).send("Bad request");
        });
};

export default validateAccount;
