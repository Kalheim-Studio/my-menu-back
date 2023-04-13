import type { Request, Response } from "express";
import { User } from "../../../../Models/User";
import { Restaurant } from "../../../../Models/Restaurant";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidV4 } from "uuid";
import { sendAccountValidationMail } from "../../../../../Utils/mailing/mailing";
import { logger } from "../../../../../Utils/logger/logger";

const registerAccount = async (req: Request, res: Response) => {
    // Creating validation token
    const token = jwt.sign(uuidV4(), String(process.env.TOKEN_KEY));

    // Hashing password before saving
    const hashedPwd = req.body.restaurant?.password
        ? await bcrypt.hash(req.body.restaurant.password, parseInt(String(process.env.SALT_ROUND)))
        : "";

    // Restaurant creation
    const newRestaurant = new Restaurant({
        name: req.body.restaurant?.name,
        address: req.body.restaurant?.address,
        postalCode: req.body.restaurant?.postalCode,
        city: req.body.restaurant?.city,
        phone: req.body.restaurant?.phone,
        email: req.body.restaurant?.email,
        password: hashedPwd,
        validated: token,
    });

    // User creation
    const newUser = new User({
        identifier: req.body.identifier,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: hashedPwd,
        restaurantId: newRestaurant.id,
        role: "restaurater",
    });

    // New entries validation
    const userValidate = newUser.validateSync();
    const restaurantValidate = newRestaurant.validateSync();

    // If one of new user or restaurant is unvalid
    if (userValidate || restaurantValidate) {
        logger("registerAccount", "Error", { errorMessage: "Error in new user or new restaurant data." });
        res.status(400).send("Error while registering");
    } else {
    // Try saving data and sending mail & response
        try {
            logger("registerAccount", "Creating account");
            // Saving data
            await newRestaurant.save();
            await newUser.save();

            logger("registerAccount", "Account saved", { successMessage: "OK" });

            // Sending validation mail
            const mailResult = await sendAccountValidationMail(newRestaurant.email, newUser.lastname, token);
            logger("registerAccount", "Account created", { successMessage: mailResult });
            res.status(201).send("Account created");
        } catch (err: unknown) {
            // Sending error
            logger("registerAccount", "Error", { errorMessage: (err as Error).message });
            res.status(400).send("Error while registering");
        }
    }
};

export default registerAccount;
