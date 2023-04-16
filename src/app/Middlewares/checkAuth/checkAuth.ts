import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import TokenData from "../../Types/TokenData";
import { logger } from "../../../Utils/logger/logger";

const checkAuth = (req: Request, res: Response, next: NextFunction) => {
    logger("checkAuth", "Checking token");
    // Checking token
    try {
    // Verifying token
    jwt.verify(String(req.headers.token), String(process.env.TOKEN_KEY)) as TokenData;
    logger("checkAuth", "Tocken checked", { successMessage: "OK" });
    next();
    } catch (err) {
        logger("checkAuth", "Error", { errorMessage: (err as Error).message });
        res.status(400).send("Authentication failed");
    }
};

export default checkAuth;
