import type { Request, Response } from "express";
import Mongoose from "mongoose";
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

    const hashedPwd = await bcrypt.hash(req.body.password, parseInt(String(process.env.SALT_ROUND)));

    // User creation
    const newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hashedPwd,
        idRestaurant: newRestaurant.id,
        role: "restaurater",
    });

    newUser.save()
        .then((userRes: Mongoose.Document) => {
            console.log("New user saved");
            newRestaurant.save()
                .then((restaurantRes: Mongoose.Document) => {
                    console.log("New Restaurant saved");
                    res.status(201).send("Register account : WIP");
                })
                .catch(err => {
                    res.status(400).send("Error while registering data");
                });
        })
        .catch((err: Mongoose.Error) => {
            console.log(err);
            res.status(400).send("Error while registering data");
        });

    // Send mail
    // TO DO
};

export default registerAccount;
