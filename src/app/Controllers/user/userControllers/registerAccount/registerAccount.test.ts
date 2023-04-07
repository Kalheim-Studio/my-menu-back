import request from "supertest";
import type { Request } from "express";
import app from "../../../../app";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Restaurant from "../../../../Models/Restaurant";
import User from "../../../../Models/User";

import { sendAccountValidationMail } from "../../../../../Utils/mailing/mailing";

// Mocking send email funtion
jest.mock("../../../../../Utils/mailing/mailing", () => ({
    sendAccountValidationMail: jest.fn().mockResolvedValue(undefined),
}));

// type RegisterAccountBody = {
//   body: {
//     firstname: string;
//     lastname: string;
//     email: string;
//     password: string;
//     restaurant: {
//       name: string;
//       address: string;
//       postalCode: string;
//       city: string;
//       phone: string;
//       email: string;
//     };
//   };
// };

describe("Testing registerAccount controller", () => {
    dotenv.config();

    const req: Request = { body: {} } as Request;

    beforeAll(async () => {
        req.body = {
            firstname: "John",
            lastname: "Doe",
            email: "john.doe@mock.com",
            password: "Abcdefgh1234!",
            restaurant: {
                name: "John's Dinner",
                address: "123 Sesame street",
                postalCode: "01234",
                city: "laputa",
                phone: "(+33)102030405",
                email: "thierry.agnelli@gmail.com",
            },
        };

        // Database connexion
        await mongoose.connect(String(process.env.DATABASE_URI));
    });

    afterAll(async () => {
    // Deleting mocking data from DB
    // Search mocked restaurant
        const restaurantRes = await Restaurant.findOne({ email: req.body.restaurant.email });
        if (restaurantRes) {
            // Deleting restaurant
            await Restaurant.deleteOne({ email: req.body.restaurant.email });
            // Searching mocked user
            const restaurantId = String(restaurantRes._id);
            const userRes = await User.findOne({ restaurantId: restaurantId });
            // Deleting user
            if (userRes) await User.deleteOne({ restaurantId: restaurantId });
        }

        // Disconnecting from database
        await mongoose.disconnect();
    });

    it("Should register new account", async () => {
        const response = await request(app).post("/user/register").send(req.body);

        // CHeck response
        expect(response.status).toBe(201);
        expect(response.text).toEqual("Account created");
        // Check mail sended
        expect(sendAccountValidationMail).toHaveBeenCalled();
    });

    it("Should fail if user already exist", async () => {
        const response = await request(app).post("/user/register").send(req.body);

        // Check response
        expect(response.status).toBe(400);
        expect(response.text).toEqual("Error while registering");
        // Check mail not sended (mock function has been called 1 times in previous test)
        expect(sendAccountValidationMail).toHaveBeenCalledTimes(1);
    });

    it("Should failed if data are not ok", async () => {
        req.body.firstname = 1;
        const response = await request(app).post("/user/register").send(req.body);

        // Check response
        expect(response.status).toBe(400);
        expect(response.text).toEqual("Error: Data are not valid.");
        // Check mail not sended (mock function has been called 1 times in previous test)
        expect(sendAccountValidationMail).toHaveBeenCalledTimes(1);
    });
});
