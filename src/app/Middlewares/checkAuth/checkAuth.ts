import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import TokenData from "../../Types/TokenData";
import { Restaurant } from "../../Models/Restaurant";
import { logger } from "../../../Utils/logger/logger";

const checkAuth = (req: Request, res: Response, next: NextFunction) => {
    logger("checkAuth", "Checking token");
    // Checking token
    try {
    // Verifying token
        const { restaurantId } = jwt.verify(String(req.headers.token), String(process.env.TOKEN_KEY)) as TokenData;

        // Check if existing account
        Restaurant.findOne({ _id: restaurantId })
            .then((result) => {
                if (!result) {
                    logger("checkAuth", "Error", { errorMessage: "No account has been found." });
                    res.status(400).send("Authentication failed");
                } else {
                    logger("checkAuth", "Token checked", { successMessage: "OK" });
                    next();
                }
            })
            .catch((err) => {
                logger("checkAuth", "Error", { errorMessage: (err as Error).message });
                res.status(400).send("Authentication failed");
            });
    } catch (err) {
        logger("checkAuth", "Error", { errorMessage: (err as Error).message });
        res.status(400).send("Authentication failed");
    }
};

export default checkAuth;
