import dotenv from "dotenv";
import mongoose from "mongoose";
import type { Request, Response, NextFunction } from "express";
import { v4 as uuid } from "uuid";
import request from "supertest";
import app from "../../../../app";
import jwt from "jsonwebtoken";
import { User } from "../../../../Models/User";
import checkAuth from "../../../../Middlewares/checkAuth/checkAuth";
import checkData from "../../../../Middlewares/checkData/checkData";

// Mocking checkAuth Middleware
jest.mock("../../../../Middlewares/checkAuth/checkAuth", () =>
    jest.fn((req: Request, res: Response, next: NextFunction) => next()));

// Mocking checkData Middleware
jest.mock("../../../../Middlewares/checkData/checkData", () =>
    jest.fn((req: Request, res: Response, next: NextFunction) => next()));

describe("createSubAccount controller test", () => {
    dotenv.config();
    const uid = uuid();

    // Mocking request
    const req = { body: {} } as Request;
    const authToken = jwt.sign({ restaurantId: uuid() }, String(process.env.TOKEN_KEY));

    beforeAll(async () => {
    // Database connection
        await mongoose.connect(String(process.env.DATABASE_TEST_URI));
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
        
        // Mocking once error on checkAuth middleware
        (checkAuth as jest.Mock).mockImplementationOnce((req: Request, res: Response) => res.status(400).send("Authentication failed") )

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
        // Mocking once error on checkData middleware
        (checkData as jest.Mock).mockImplementationOnce((req: Request, res: Response) => res.status(400).send("Error: Data are not valid.") )

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
