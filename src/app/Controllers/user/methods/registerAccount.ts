import type { Request, Response } from "express";
import User from "../../../Models/User";
import Restaurant from "../../../Models/Restaurant";
import bcrypt from "bcrypt";

const registerAccount = async (req: Request, res: Response) => {
    // Restaurant creation
    const newRestaurant = new Restaurant({
        name: String(req.body.restaurant.name),
        address: String(req.body.restaurant.address),
        phone: String(req.body.restaurant.phone),
        email: String(req.body.restaurant.email),
    });
    // const response = await newRestaurant.save();

    const hashedPwd = await bcrypt.hash(req.body.password, parseInt(String(process.env.SALT_ROUND)));

    // User creation
    const newUser = new User({
        firstname: String(req.body.firstname),
        lastname: String(req.body.lastname),
        email: String(req.body.email),
        password: String(hashedPwd),
        idRestaurant: String(newRestaurant.id),
        role: "restaurater",
    });
    // await newUser.save();

    // Send mail
    // TO DO

    res.status(201).send("Register account : WIP");
};

export default registerAccount;
