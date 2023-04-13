import request from "supertest";
import type { Request } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { Restaurant } from "../../../../Models/Restaurant";
import app from "../../../../app";
import { ReadStream } from "fs";

describe("Testing authenticate controller", () => {
    dotenv.config();
    const req: Request = { body: {} } as Request;
    const token = jwt.sign("test-token", String(process.env.TOKEN_KEY));
    let restaurantId = "";

    // Mock new restaurant
    beforeAll(async () => {
        await mongoose.connect(String(process.env.DATABASE_URI));
        const hashedPwd = await bcrypt.hash("Abcdefgh1234!", parseInt(String(process.env.SALT_ROUND)));

        const newRestaurant = new Restaurant({
            name: "John's Dinner",
            address: "123 Sesame street",
            postalCode: "01234",
            city: "laputa",
            phone: "(+33)102030405",
            password: hashedPwd,
            email: "john.doe@authentication.com",
            validated: token,
        });
        restaurantId = String(newRestaurant._id);
        await newRestaurant.save();
    });

    // Delete mocked restaurant
    afterAll(async () => {
        const newRestaurant = await Restaurant.findOne({ email: "john.doe@authentication.com" });

        if (newRestaurant) await Restaurant.deleteOne({ email: "john.doe@authentication.com" });

        // Disconnecting from database
        await mongoose.disconnect();
    });

    it("Error in email login Data", async () => {
        req.body = {
            email: "john.doeauthentication.com",
            password: "Abcdefgh1234!",
        };

        const response = await request(app).post("/user/authentication").send(req.body);

        expect(response.status).toBe(400);
        expect(response.text).toBe("Error: Data are not valid.");
    });

    it("Error in password Data", async () => {
        req.body = {
            email: "john.doe@authentication.com",
            password: "Abcdefgh1234",
        };

        const response = await request(app).post("/user/authentication").send(req.body);

        expect(response.status).toBe(400);
        expect(response.text).toBe("Error: Data are not valid.");
    });

    it("Error wrong login", async () => {
        req.body = {
            email: "johndoe@authentication.com",
            password: "Abcdefgh1234!",
        };

        const response = await request(app).post("/user/authentication").send(req.body);

        expect(response.status).toBe(400);
        expect(response.text).toBe("Email ou mot de passe incorrect");
    });

    it("Error wrong password", async () => {
        req.body = {
            email: "john.doe@authentication.com",
            password: "Abcdefgh1234!!",
        };

        const response = await request(app).post("/user/authentication").send(req.body);

        expect(response.status).toBe(400);
        expect(response.text).toBe("Email ou mot de passe incorrect");
    });

    it("Error account not validated", async () => {
        req.body = {
            email: "john.doe@authentication.com",
            password: "Abcdefgh1234!",
        };

        const response = await request(app).post("/user/authentication").send(req.body);
        expect(response.status).toBe(400);
        expect(response.text).toBe("Le compte n'a pas encore été validé");
    });

    it("Authenticate OK", async () => {
        req.body = {
            email: "john.doe@authentication.com",
            password: "Abcdefgh1234!",
        };

        await Restaurant.updateOne({ email: "john.doe@authentication.com" }, { validated: "true" });

        const authToken = jwt.sign(
            {
                restaurantId: restaurantId,
            },
            String(process.env.TOKEN_KEY)
        );

        const response = await request(app).post("/user/authentication").send(req.body);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            token: authToken,
        });
    });
});
