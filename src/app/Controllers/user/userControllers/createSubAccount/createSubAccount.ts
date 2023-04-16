import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { logger } from "../../../../../Utils/logger/logger";
import TokenData from "../../../../Types/TokenData";
import { User } from "../../../../Models/User";

const createSubAccount = async (req: Request, res: Response) => {
    logger(__dirname, "Account creation");
    // Can't create an Owner role sub account
    if (req.body.role == "Owner") {
        logger(__dirname, "Error", { errorMessage: "Can't create sub accoutn with Owner role" });
        res.status(400).send("Error while registering.");
    } else {
    // Getting restaurantId from auth token
        const { restaurantId } = jwt.decode(String(req.headers.token)) as TokenData;

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
            logger(__dirname, "Error", { errorMessage: "Error on new account data field" });
            res.status(400).send("Error while registering.");
        } else {
            // savinng new user sub account
            logger(__dirname, "Saving sub account");
            newUser.save();
            logger(__dirname, "Sub account creation", { successMessage: "OK" });
            res.status(201).send("Account Created");
        }
    }
};

export default createSubAccount;
