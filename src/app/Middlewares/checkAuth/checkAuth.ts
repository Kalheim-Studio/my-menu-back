import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import TokenData from "../../Types/TokenData";
import { Restaurant } from "../../Models/Restaurant";
import { logger } from "../../../Utils/logger/logger";

const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
    let validAuth = false;

    logger(__dirname, "Checking token");

    // Checking token
    try {
    // Verifying token
        const authToken = String(req.headers.authorization).replace("Bearer ", "");
        const { restaurantId } = jwt.verify(authToken, String(process.env.TOKEN_KEY)) as TokenData;

        logger(__dirname, "Token checked", { infoMessage: "Checking account in database" });

        // Checking in database
        const result = await Restaurant.findOne({ _id: restaurantId });

        // If an account has been found
        if (result) {
            // Check if account has been validated
            validAuth = result.validated === "true";
            if (!validAuth) logger(__dirname, "Token checked", { successMessage: "OK" });
            else logger(__dirname, "Token checked", { errorMessage: "Account not validated" });
        } else logger(__dirname, "Error", { errorMessage: "No Account has been found." });
    } catch (err) {
        logger(__dirname, "Error", { errorMessage: (err as Error).message });
    }

    // Grant access to route if valid authentication
    if (validAuth) next();
    else res.status(401).send("Authentication failed");
};

export default checkAuth;
