import type { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import checkAuth from "./checkAuth";

import { Restaurant } from "../../Models/Restaurant";

import colors, { bgYellow } from "colors";

describe("checkAuth middleware test", () => {
    dotenv.config();

    const req: Request = { headers: {} } as Request;
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
    const next = jest.fn() as NextFunction;
    const errorMessage = "Authentication failed";

    let restaurantId: string;

    beforeAll(async () => {
        await mongoose.connect(String(process.env.DATABASE_URI));

        const mockRestaurant = new Restaurant({
            name: "John's Dinner",
            address: "123 Sesame street",
            postalCode: "01234",
            city: "laputa",
            phone: "(+33)102030405",
            email: "John.Doe@check-auth.com",
            password: "Abcdefgh1234!",
            validated: "true"
        });

        restaurantId = String(mockRestaurant._id);

        await mockRestaurant.save();
    });

    afterAll(async ()=> {
        
        await Restaurant.deleteOne({_id: restaurantId})
        await mongoose.disconnect();
    });

    // it("Checking valid unlimitted token",async () => {
    // // Generating unlimited valid token
    //     const token = jwt.sign({ restaurantId: restaurantId }, String(process.env.TOKEN_KEY));
    //     req.headers = {
    //         token: token,
    //     };

    //     checkAuth(req, res, next);

    //     expect(next).toHaveBeenCalled();
    // });

    // it("Checking valid limited token", () => {
    // // Generatin 2 hours token
    //     const token = jwt.sign({ restaurantId: restaurantId }, String(process.env.TOKEN_KEY), {
    //         expiresIn: "2h",
    //     });
    //     req.headers = {
    //         token: token,
    //     };

    //     checkAuth(req, res, next);

    //     expect(next).toHaveBeenCalled();
    // });

    it("Checking expired token", () => {
    // Generating expired 2h hours token (backdating it by 2.5h)
        const token = jwt.sign(
            { restaurantId: restaurantId, iat: Math.floor(Date.now() / 1000) - 60 * 60 * 2.5 },
            String(process.env.TOKEN_KEY),
            {
                expiresIn: "2h",
            }
        );
        req.headers = {
            token: token,
        };

        checkAuth(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(errorMessage);
    });

    // it("Checking token with unvalid secret key", () => {
    // // Generating a token with an unvalid secret key
    //     const token = jwt.sign({ restaurantId: restaurantId }, "Wrong_Secret_Key");
    //     req.headers = {
    //         token: token,
    //     };

    //     checkAuth(req, res, next);

    //     expect(res.status).toHaveBeenCalledWith(400);
    //     expect(res.send).toHaveBeenCalledWith(errorMessage);
    // });

    // it("Checking wrong format token", () => {
    // // Wrong format token
    //     req.headers = {
    //         token: "thisabadformattoken",
    //     };

    //     checkAuth(req, res, next);

    //     expect(res.status).toHaveBeenCalledWith(400);
    //     expect(res.send).toHaveBeenCalledWith(errorMessage);
    // });

    // it("Checking unknwon account", () => {
    //     const authToken = jwt.sign({ restauranId: "thisanunknownaccountid"}, String(process.env.TOKEN_KEY))
    //     // Wrong format token
    //         req.headers = {
    //             token: authToken,
    //         };
    
    //         checkAuth(req, res, next);
    
    //         expect(res.status).toHaveBeenCalledWith(400);
    //         expect(res.send).toHaveBeenCalledWith(errorMessage);
    // });
});
