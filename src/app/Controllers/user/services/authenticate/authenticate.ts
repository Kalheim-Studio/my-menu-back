import type { Request } from "express";
import { logger } from "../../../../../Utils/logger/logger";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Restaurant } from "../../../../Models/Restaurant";
import { User } from "../../../../Models/User";

const authentication = async (req: Request) => {
    logger(__dirname, "Authentication attempt");

    // Searching for account to connect
    const result = await Restaurant.findOne({ email: req.body.email });

    // If wronf email
    if (!result) throw new Error("Login or password incorrect, or unhautorized account");

    // If manager, search user subAccount
    let manager: {
    restaurantId: string;
    password: string;
  } | null = null;

    if (req.body.identifier) {
        manager = await User.findOne({
            identifier: req.body.identifier,
            role: "Manager",
            restaurantId: result._id,
        });
        if (!manager) throw new Error("No manager account found");
    }
    // Getting which password to check
    const password = manager?.password ?? result.password;

    // Check if account found and paswword OK
    if (password && bcrypt.compareSync(req.body.password, password)) {
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

            logger(__dirname, "Authentication", { successMessage: "Granted" });
            return token;
        } else {
            // Response not validated
            throw new Error("Account not validated");
        }
    } else {
    // Response email or password incorrect
        throw new Error("Login or password incorrect, or unhautorized account");
    }
};

export default authentication;
