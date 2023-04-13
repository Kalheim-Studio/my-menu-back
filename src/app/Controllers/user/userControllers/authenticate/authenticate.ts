import type { Request, Response } from "express";
import { logger } from "../../../../../Utils/logger/logger";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Restaurant } from "../../../../Models/Restaurant";

const authentication = async (req: Request, res: Response) => {
    logger("authenticate", "Authentication attempt");

    // Searching for account to connect
    const result = await Restaurant.findOne({ email: req.body.email });

    // Check if account found and paswword OK
    if (result && bcrypt.compareSync(req.body.password, result.password)) {
    // Check if account has been valdiated
        if (result.validated === "true") {
            const token = jwt.sign(
                {
                    restaurantId: result._id,
                },
                String(process.env.TOKEN_KEY)
            );

            res.status(200).json({
                token: token,
            });
        } else {
            // Response not validated
            logger("autenticate", "Error", { errorMessage: "Account not validated" });
            res.status(400).send("Le compte n'a pas encore été validé");
        }
    } else {
    // Response email or password incorrect
        logger("autenticate", "Error", { errorMessage: "Login or password incorrect" });
        res.status(400).send("Email ou mot de passe incorrect");
    }
};

export default authentication;
