import type { Request } from "express";
import { User } from "../../../../Models/User";
import { Restaurant } from "../../../../Models/Restaurant";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidV4 } from "uuid";
import { logger, sendAccountValidationMail } from "../../../../../Utils";

const registerAccount = async (req: Request) => {
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
        role: "Owner",
    });

    // New entries validation
    const userValidate = newUser.validateSync();
    const restaurantValidate = newRestaurant.validateSync();

    logger(__dirname, "Attempting to create account.");

    // If one of new user or restaurant is unvalid
    if (userValidate || restaurantValidate) {
    // throw error
        throw new Error("Error in new user or new restaurant data");
    } else {
        logger(__dirname, "Creating account");

        // Saving data
        await newRestaurant.save();
        await newUser.save();

        logger(__dirname, "Account saved", { successMessage: "OK" });

        // Sending validation mail
        const mailResult = await sendAccountValidationMail(newRestaurant.email, newUser.lastname, token);
        logger(__dirname, "Account created", { successMessage: mailResult });
    }
};

export { registerAccount };
