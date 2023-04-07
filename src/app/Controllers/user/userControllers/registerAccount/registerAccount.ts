import type { Request, Response } from "express";
import User from "../../../../Models/User";
import Restaurant from "../../../../Models/Restaurant";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidV4 } from "uuid";
import { sendAccountValidationMail } from "../../../../../Utils/mailing/mailing";
import { logger } from "../../../../../Utils/logger/logger";

const registerAccount = async (req: Request, res: Response) => {
    // Creating validation token
    const token = jwt.sign({ name: req.body.restaurant.name + uuidV4() }, String(process.env.TOKEN_KEY));

    // Restaurant creation
    const newRestaurant = new Restaurant({
        name: req.body.restaurant.name,
        address: req.body.restaurant.address,
        postalCode: req.body.restaurant.postalCode,
        city: req.body.restaurant.city,
        phone: req.body.restaurant.phone,
        email: req.body.restaurant.email,
        validated: token,
    });

    // Hashing password before saving
    const hashedPwd = req.body.password
        ? await bcrypt.hash(req.body.password, parseInt(String(process.env.SALT_ROUND)))
        : "";

    // User creation
    const newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hashedPwd,
        restaurantId: newRestaurant.id,
        role: "restaurater",
    });

    // New entries validation
    const userValidate = newUser.validateSync();
    const restaurantValidate = newRestaurant.validateSync();

    // If one of new user or restaurant is unvalid
    if (userValidate || restaurantValidate) {
        logger("Error in new user or new restaurant data.");
        res.status(400).send("Error while registering");
    } else {
    // Saving and sendig OK response
        try {
            logger("Creating account");
            await newUser.save();
            await newRestaurant.save();
            logger("Account saved");
            // Send validation mail
            sendAccountValidationMail(newRestaurant.email, newUser.lastname, token)
                .then(() => {
                    console.log("email sent");
                    res.status(201).send("Account created");
                })
                .catch((err) => logger(err.message));
        } catch (err) {
            res.status(400).send("Error while registering");
        }
    }
};

export default registerAccount;
