import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import TokenData from "../../Types/TokenData";
import { Restaurant } from "../../Models/Restaurant";
import { logger } from "../../../Utils/logger/logger";

const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
    let validAuth = false;

    logger("checkAuth", "Checking token");

    // Checking token
    try {
    // Verifying token
        const { restaurantId } = jwt.verify(String(req.headers.token), String(process.env.TOKEN_KEY)) as TokenData;
        logger(__dirname, "Token checked", { infoMessage: "Checking account in database" });

        // Checking in database
        const result = await Restaurant.findOne({ _id: restaurantId });

        if (result) {
            logger("checkAuth", "Token checked", { successMessage: "OK" });
            validAuth = true;
        } else logger(__dirname, "Error", { errorMessage: "No Account has been found." });
    } catch (err) {
        logger(__dirname, "Error", { errorMessage: (err as Error).message });
    }

    if (!validAuth) res.status(400).send("Authentication failed");
    else next();
};

export default checkAuth;
