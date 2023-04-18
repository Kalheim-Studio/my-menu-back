import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import TokenData from "../../Types/TokenData";
import { Restaurant } from "../../Models/Restaurant";
import { logger } from "../../../Utils/logger/logger";
import colors, { bgYellow } from "colors";

const checkAuth = (req: Request, res: Response, next: NextFunction) => {
    let validAuth = false;

    logger("checkAuth", "Checking token");

    (async () =>{
        // Checking token
        try {
            // Verifying token
            const tokenChecker = jwt.verify(String(req.headers.token), String(process.env.TOKEN_KEY)) as TokenData;
            // if(tokenChecker){
                logger(__dirname, "Token checked", {infoMessage: "Checking account in database"})
                const result = await Restaurant.findOne({_id: tokenChecker.restaurantId})
                if(result){
                    console.log(colors.bgYellow("result"));
                    logger("checkAuth", "Token checked", { successMessage: "OK" });
                    validAuth = true;
                }
                else
                    logger(__dirname, "Error", { errorMessage: "No Account has been found."});
        } catch (err) {
            console.log(colors.bgRed(" first level catch"))
            logger(__dirname, "Error", { errorMessage: (err as Error).message });
        }
    })();

    if(!validAuth)
        res.status(400).send("Authentication failed");

    next();
};

export default checkAuth;
