import type { Request } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { logger } from "../../../../../Utils";
import { AuthToken } from "../../../../Types";
import { User } from "../../../../Models/User";

const createSubAccount = async (req: Request) => {
    logger(__dirname, "Account creation");
    // Can't create an Owner role sub account
    if (req.body.role == "Owner") {
        throw new Error("Can't create sub account with Owner role");
    } else {
    // Getting restaurantId from auth token
        const authToken = String(req.headers.authorization).replace("Bearer ", "");
        const { restaurantId } = jwt.decode(authToken) as AuthToken;

        // Check if a sub account already exist for this restaurant
        const results = await User.find({ restaurantId: restaurantId, identifier: req.body.identifier });

        if (results.length > 0) {
            const error = new Error("An account with this identifier already exist for this restaurant");
            error.name = "duplicate-account";
            throw error;
        }

        // Hashing password before saving
        const hashedPwd = req.body.password
            ? await bcrypt.hash(req.body.password, parseInt(String(process.env.SALT_ROUND)))
            : "";

        // Creating new User sub account
        const newUser = new User({
            identifier: req.body.identifier,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            password: hashedPwd,
            role: req.body.role,
            restaurantId: restaurantId,
        });

        // newUser validation
        const isValidNewUser = newUser.validateSync();

        // If user sub acocunt not valid
        if (isValidNewUser) {
            throw new Error("Error on new account data field");
        } else {
            // savinng new user sub account
            logger(__dirname, "Saving sub account");
            newUser.save();
            logger(__dirname, "Sub account creation", { successMessage: "OK" });
        }
    }
};

export { createSubAccount };
