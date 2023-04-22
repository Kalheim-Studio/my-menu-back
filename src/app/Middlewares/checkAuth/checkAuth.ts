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

        if (result) {
            logger(__dirname, "Token checked", { successMessage: "OK" });
            validAuth = true;
        } else logger(__dirname, "Error", { errorMessage: "No Account has been found." });
    } catch (err) {
        logger(__dirname, "Error", { errorMessage: (err as Error).message });
    }

    if (!validAuth) res.status(401).send("Authentication failed");
    else next();
};

export default checkAuth;
