import dotenv from "dotenv";
import mongoose from "mongoose";
import type { Request } from "express";
import { v4 as uuid } from "uuid";
import request from "supertest";
import app from "../../../../app";
import jwt from "jsonwebtoken";
import { User } from "../../../../Models/User";

describe("createSubAccount controller test", () => {
    dotenv.config();
    const uid = uuid();

    // Mocking request
    const req = { body: {} } as Request;
    const authToken = jwt.sign({ restaurantId: uuid() }, String(process.env.TOKEN_KEY));

    beforeAll(async () => {
    // Database connection
        await mongoose.connect(String(process.env.DATABASE_URI));
    });

    beforeEach(() => {
    // Mocking Data
        req.body = {
            identifier: "John_Doe_" + uid,
            firstname: "John",
            lastname: "Doe",
            password: "Abcdefgh1234!",
            role: "Manager",
        };
    });

    afterEach(() => {
    // Delete Mock Data
        User.deleteOne({ identifier: "John_Doe_" + uid });
    });

    afterAll(async () => {
    // Database disconnection
        await mongoose.disconnect();
    });

    it("Should response error if authentication failed", async () => {
        const response = await request(app)
            .post("/user/create-sub-account")
            .set("token", "thisisabadtoken")
            .send(req.body);

        // Search for entry in database
        const userResult = await User.findOne({ identifier: "John_Doe_" + uid });

        expect(userResult).toBeNull();

        expect(response.status).toBe(400);
        expect(response.text).toBe("Authentication failed");
    });

    it("Should response error if data are not valid", async () => {
        req.body.role = 1;

        const response = await request(app)
            .post("/user/create-sub-account")
            .set("token", authToken)
            .send(req.body);

        // Search for entry in database
        const userResult = await User.findOne({ identifier: "John_Doe_" + uid });

        expect(userResult).toBeNull();

        expect(response.status).toBe(400);
        expect(response.text).toBe("Error: Data are not valid.");
    });

    it("Should response error if role is owner", async () => {
        req.body.role = "Owner";

        const response = await request(app)
            .post("/user/create-sub-account")
            .set("token", authToken)
            .send(req.body);

        // Search for entry in database
        const userResult = await User.findOne({ identifier: "John_Doe_" + uid });

        expect(userResult).toBeNull();

        expect(response.status).toBe(400);
        expect(response.text).toBe("Error while registering.");
    });

    it("Should response error if missing Data", async () => {
        req.body = {
            identifier: "John_Doe_" + uid,
            firstname: "John",
            lastname: "Doe",
            role: "Manager",
        };

        const response = await request(app)
            .post("/user/create-sub-account")
            .set("token", authToken)
            .send(req.body);

        // Search for entry in database
        const userResult = await User.findOne({ identifier: "John_Doe_" + uid });

        expect(userResult).toBeNull();

        expect(response.status).toBe(400);
        expect(response.text).toBe("Error while registering.");
    });

    it("Should register new sub account", async () => {
        const response = await request(app)
            .post("/user/create-sub-account")
            .set("token", authToken)
            .send(req.body);

        // Search for entry in database
        const userResult = await User.findOne({ identifier: "John_Doe_" + uid });

        expect(userResult).not.toBeNull();

        expect(response.status).toBe(201);
        expect(response.text).toBe("Account Created");
    });
});
