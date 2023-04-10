import request from "supertest";
import type { Request } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Restaurant from "../../../../Models/Restaurant";
import app from "../../../../app";

describe("Testing validateAccount controller", () => {
    dotenv.config();
    const req: Request = { body: {} } as Request;
    const token = jwt.sign("test-token", String(process.env.TOKEN_KEY));

    // Mock new restaurant
    beforeAll(async () => {
    // Database connexion
        await mongoose.connect(String(process.env.DATABASE_URI));

        const newRestaurant = new Restaurant({
            name: "John's Dinner",
            address: "123 Sesame street",
            postalCode: "01234",
            city: "laputa",
            phone: "(+33)102030405",
            email: "john.doe@validate-account.com",
            validated: token,
        });

        await newRestaurant.save();
    });

    // Delete mocked restaurant
    afterAll(async () => {
        const newRestaurant = await Restaurant.findOne({ email: "john.doe@validate-account.com" });

        if (newRestaurant) await Restaurant.deleteOne({ email: "john.doe@validate-account.com" });

        // Disconnecting from database
        await mongoose.disconnect();
    });

    it("Should validate new account", async () => {
        console.log("URL :", "/user/validate-account/" + token);
        const response = await request(app).put("/user/validate-account/" + token);

        expect(response.status).toBe(200);
        expect(response.text).toBe("Account has been validated");

        const newRestaurant = await Restaurant.findOne({ email: "john.doe@mock.com" });
        expect(newRestaurant).toBe(null);
    });

    it("Should return 400 if account already validated", async () => {
        const response = await request(app)
            .put("/user/validate-account/" + token)
            .send(req.body);

        expect(response.status).toBe(400);
        expect(response.text).toBe("No account to validate have been found");
    });
});
