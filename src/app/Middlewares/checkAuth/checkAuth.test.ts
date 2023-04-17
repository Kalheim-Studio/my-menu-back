import type { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { Restaurant } from "../../Models/Restaurant";
import checkAuth from "./checkAuth";

describe("checkAuth middleware test", () => {
    const req: Request = { headers: {} } as Request;
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
    const next = jest.fn() as NextFunction;
    // const next = (() => console.log(colors.bgGreen("next called"))) as NextFunction;
    const errorMessage = "Authentication failed";

    dotenv.config();

    let restaurantId: string;

    beforeAll(async () => {
        await mongoose.connect(String(process.env.DATABASE_URI));
        // Mocking main account
        const newRestaurant = new Restaurant({
            name: "John's Dinner",
            address: "123 Sesame street",
            postalCode: "01234",
            city: "laputa",
            phone: "(+33)102030405",
            email: "johnsdinner@check-autht.com",
            password: "Abcdefgh1234!",
            validated: "true",
        });
        await newRestaurant.save();

        restaurantId = String(newRestaurant._id);
    });

    afterAll(async () => {
    // Deleteing mocked data
        await Restaurant.deleteOne({ _id: restaurantId });
        await mongoose.disconnect();
    });

    it("Checking valid unlimitted token", async () => {
    // Generating unlimited valid token
        const token = jwt.sign({ restaurantId: restaurantId }, String(process.env.TOKEN_KEY));
        req.headers = {
            token: token,
        };

        await checkAuth(req, res, next);

        expect(res.send).not.toHaveBeenCalled();
    // expect(next).toHaveBeenCalledWith();
    });

    it("Checking valid limited token", () => {
    // Generatin 2 hours token
        const token = jwt.sign({ restaurantId: restaurantId }, String(process.env.TOKEN_KEY), {
            expiresIn: "2h",
        });
        req.headers = {
            token: token,
        };

        checkAuth(req, res, next);

        expect(res.send).not.toHaveBeenCalled();
    // expect(next).toHaveBeenCalledWith();
    });

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

        expect(next).not.toHaveBeenCalledWith();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(errorMessage);
    });

    it("Checking token with unvalid secret key", () => {
    // Generating a token with an unvalid secret key
        const token = jwt.sign({ restaurantId: restaurantId }, "Wrong_Secret_Key");
        req.headers = {
            token: token,
        };

        checkAuth(req, res, next);

        expect(next).not.toHaveBeenCalledWith();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(errorMessage);
    });

    it("Checking wrong token", () => {
    // Wrong token
        const token = jwt.sign({ restaurantId: "thisabadtoken" }, String(process.env.TOKEN_KEY));
        req.headers = {
            token: token,
        };

        checkAuth(req, res, next);

        expect(next).not.toHaveBeenCalledWith();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(errorMessage);
    });

    it("Checking wrong format token", () => {
    // Wrong format token
        req.headers = {
            token: "thisabadformattoken",
        };

        checkAuth(req, res, next);

        expect(next).not.toHaveBeenCalledWith();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(errorMessage);
    });
});
