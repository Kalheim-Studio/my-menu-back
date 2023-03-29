import type { Request, Response } from "express";
import User from "../../../Models/User";
import Restaurant from "../../../Models/Restaurant";
import bcrypt from "bcrypt";

const registerAccount = async (req: Request, res: Response) => {
    // Restaurant creation
    const newRestaurant = new Restaurant({
        name: req.body.restaurant.name,
        address: req.body.restaurant.address,
        postalCode: req.body.restaurant.postalCode,
        city: req.body.restaurant.city,
        phone: req.body.restaurant.phone,
        email: req.body.restaurant.email,
    });

    const hashedPwd = req.body.password
        ? await bcrypt.hash(req.body.password, parseInt(String(process.env.SALT_ROUND)))
        : "";

    // User creation
    const newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hashedPwd,
        idRestaurant: newRestaurant.id,
        role: "restaurater",
    });
    const userValidate = newUser.validateSync();
    const restaurantValidate = newRestaurant.validateSync();

    // If one of new user or restaurant is unvalid
    if (userValidate || restaurantValidate) res.status(400).send("Error while registering");
    else {
    // Saving and sendig OK response
        await newUser.save();
        await newRestaurant.save();
        res.status(201).send("Account created");
    }

    // Send mail
    // TO DO
};

export default registerAccount;
