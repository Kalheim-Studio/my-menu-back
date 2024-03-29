import type { Request } from "express";
import { logger } from "../../../../../Utils";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Restaurant } from "../../../../Models/Restaurant";
import { User } from "../../../../Models/User";

const authenticate = async (req: Request) => {
    logger(__dirname, "Authentication attempt");

    // Searching for account to connect
    const result = await Restaurant.findOne({ email: req.body.email });

    // If wrong email
    if (!result) throw new Error("Login or password incorrect, or unhautorized account");

    let password = result.password;

    // If manager, search user subAccount
    let managers;
    let index;

    if (req.body.role === "Manager") {
        logger(__dirname, "Manager account");
        
        managers = await User.find({
            role: "Manager",
            restaurantId: result._id,
        });

        if (managers.length === 0) throw new Error("No manager account found");
        
        // Getting manager index
        index = managers?.findIndex(manager => manager.identifier === req.body.identifier);
        
        // Changing password to check to manager password
        password = managers[index].password;
    }

    // Check if account found and paswword OK
    if (password && bcrypt.compareSync(req.body.password, password)) {

        // Check if account has been validated
        if (result.validated === "true") {
            // token payload
            const payload = {
                restaurantId: String(result._id),
                role: req.body.identifier ? "Manager-" + index : "Owner"
            };
            
            const token = req.body.stayLogged
                ? jwt.sign(
                    payload,
                    String(process.env.TOKEN_KEY)
                )
                : jwt.sign(
                    payload,
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

export { authenticate };
