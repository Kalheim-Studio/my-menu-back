import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthToken } from "../../Types";
import { logger } from "../../../Utils";

const checkOwnerRole = (req: Request, res: Response, next: NextFunction) => {
    logger(__dirname, "Checking role");

    // getting role
    const authToken = String(req.headers.authorization).replace("Bearer ", "");
    const { role } = jwt.verify(authToken, String(process.env.TOKEN_KEY)) as AuthToken;

    if(role != "Owner"){
        logger(__dirname, "Role checked", { errorMessage: "Not Owner role" });
        res.status(401).send("Unhautorized");
    }
    else{
        logger(__dirname, "Role checked", { successMessage: "Owner role OK" });
        next();
    }
};

export {checkOwnerRole};
