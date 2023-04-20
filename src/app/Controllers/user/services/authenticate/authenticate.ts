import type { Request } from "express";
import { logger } from "../../../../../Utils/logger/logger";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Restaurant } from "../../../../Models/Restaurant";

const authentication = async (req: Request) => {
    logger("authenticate", "Authentication attempt");

    // Searching for account to connect
    const result = await Restaurant.findOne({ email: req.body.email });

    // Check if account found and paswword OK
    if (result && bcrypt.compareSync(req.body.password, result.password)) {
    // Check if account has been valdiated
        if (result.validated === "true") {
            const token = req.body.stayLogged
                ? jwt.sign(
                    {
                        restaurantId: String(result._id),
                    },
                    String(process.env.TOKEN_KEY)
                )
                : jwt.sign(
                    {
                        restaurantId: String(result._id),
                    },
                    String(process.env.TOKEN_KEY),
                    { expiresIn: "2h" }
                );
            return token;
        } else {
            // Response not validated
            logger("autenticate", "Error", { errorMessage: "Account not validated" });
            throw new Error("Account not validated");
        }
    } else {
    // Response email or password incorrect
        logger("autenticate", "Error", { errorMessage: "Login or password incorrect" });
        throw new Error("Login or password incorrect");
    }
};

export default authentication;
