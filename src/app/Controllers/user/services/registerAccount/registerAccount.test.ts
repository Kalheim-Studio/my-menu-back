import request from "supertest";
import type { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "../../../../app";
import { Restaurant } from "../../../../Models/Restaurant";
import { User } from "../../../../Models/User";
import { sendAccountValidationMail } from "../../../../../Utils/mailing/mailing";
import registerAccount from "./registerAccount";

import colors from "colors";

// Mocking send email funtion
jest.mock("../../../../../Utils/mailing/mailing", () => ({
    sendAccountValidationMail: jest.fn().mockResolvedValue(undefined),
}));

describe("Testing registerAccount controller", () => {
    dotenv.config();

    const req = { body: {} } as Request;
    const res = {} as Response;

    beforeAll(async () => {
    // Database connexion
        // await mongoose.connect(String(process.env.DATABASE_URI));
    });

    // Mocking Req.body before each test
    beforeEach(async () => {
        req.body = {
            identifier: "John_Doe",
            firstname: "John",
            lastname: "Doe",
            restaurant: {
                name: "John's Dinner",
                address: "123 Sesame street",
                postalCode: "01234",
                city: "laputa",
                phone: "(+33)102030405",
                email: "John.Doe@register-account.com",
                password: "Abcdefgh1234!",
            },
        };
    });

    afterAll(async () => {
    // Deleting mocking data from DB
    // Search mocked restaurant
        // const restaurantRes = await Restaurant.findOne({ email: req.body.restaurant.email });
        // if (restaurantRes) {
        //     // Deleting restaurant
        //     await Restaurant.deleteOne({ email: req.body.restaurant.email });
        //     // Searching mocked user
        //     const restaurantId = String(restaurantRes._id);
        //     const userRes = await User.findOne({ restaurantId: restaurantId });
        //     // Deleting user
        //     if (userRes) await User.deleteOne({ restaurantId: restaurantId });
        // }

        // Disconnecting from database
        // await mongoose.disconnect();
    });

    it("Should fail if user missing", async () => {
        req.body = {
            restaurant: {
                name: "John's Dinner",
                address: "123 Sesame street",
                postalCode: "01234",
                city: "laputa",
                phone: "(+33)102030405",
                email: "john.doe@register-account.com",
                password: "Abcdefgh1234!",
            },
        };

        try{
            await registerAccount(req, res);
        }
        catch(err){
            expect(err).toBeDefined();
            expect((err as Error).message).toBe("Error while registering");

            // Check mail not sended
            expect(sendAccountValidationMail).not.toHaveBeenCalled();
        }
    });

    it("Should fail if restaurant missing", async () => {
        req.body = {
            identifier: "John_Doe",
            firstname: "John",
            lastname: "Doe",
            email: "john.doe@mock.com",
        };

        try{
            await registerAccount(req, res);
        }
        catch(err){
            expect(err).toBeDefined();
            expect((err as Error).message).toBe("Error while registering");

            // Check mail not sended
            expect(sendAccountValidationMail).not.toHaveBeenCalled();
        }
    });

    // it("Should failed if data are not ok", async () => {
    //     req.body.firstname = 1;
    //     const response = await request(app).post("/user/register").send(req.body);
    //     // Check response
    //     // expect(response.status).toBe(400);
    //     // expect(response.text).toEqual("Error: Data are not valid.");
    //     // // Check mail not sended (mock function has been called 1 times in previous test)
    //     // expect(sendAccountValidationMail).toHaveBeenCalledTimes(0);
    // });

    it("Should register new account", async () => {
    //     // const response = await request(app).post("/user/register").send(req.body);
        Restaurant.prototype.save = jest.fn();
        User.prototype.save = jest.fn();

        try{
            await registerAccount(req, res);
            console.log(colors.bgGreen("Success"));

            expect(Restaurant.prototype.save).toHaveBeenCalled();
            expect(User.prototype.save).toHaveBeenCalled();
            expect(sendAccountValidationMail).toHaveBeenCalled();

        }
        catch(err){
            console.log(err);
            expect(err).not.toBeDefined();
        }



    //     // Check response
    // //     expect(response.status).toBe(201);
    // //     expect(response.text).toEqual("Account created");
    // //     // Check mail sended
    // //     expect(sendAccountValidationMail).toHaveBeenCalled();
    // // });

    // // it("Should fail if account already exist", async () => {
    // //     const response = await request(app).post("/user/register").send(req.body);

    // //     // Check response
    // //     expect(response.status).toBe(400);
    // //     expect(response.text).toEqual("Error while registering");
    // //     // Check mail not sended (mock function has been called 1 times in previous test)
    //     // expect(sendAccountValidationMail).toHaveBeenCalledTimes(1);
    //     expect(sendAccountValidationMail).toHaveBeenCalled();
    });
});
