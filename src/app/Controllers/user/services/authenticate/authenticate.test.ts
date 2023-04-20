import type { Request } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { Restaurant } from "../../../../Models/Restaurant";
import authenticate from "./authenticate";
import TokenData from "../../../../Types/TokenData";

describe("Testing authenticate controller", () => {
    dotenv.config();
    const req: Request = { body: {} } as Request;

    it("Should throw error if wrong login", async () => {
        req.body = {
            email: "thierry.agnelli@gmail.com",
            password: "Abcdefgh1234!l",
            stayLogged: true,
        };

        // Mock database request
        Restaurant.findOne = jest.fn().mockResolvedValue({
            password: "mockPassword",
            validated: "true",
        });

        let authToken;

        try {
            authToken = await authenticate(req);
        } catch (err) {
            // Expect token to not be defined
            expect(authToken).not.toBeDefined();
            // Expect error to has been thrown
            expect(err).toBeDefined();
            expect((err as Error).message).toBe("Login or password incorrect");
        }
    });

    it("Should throw error if account not validated", async () => {
    // Mock request body
        req.body = {
            email: "john.doe@authentication.com",
            password: "Abcdefgh1234!",
            stayLogged: true,
        };

        // Mock hashed password
        const hashedPwd = await bcrypt.hash(req.body.password, parseInt(String(process.env.SALT_ROUND)));

        // Mock database request
        Restaurant.findOne = jest.fn().mockResolvedValue({
            password: hashedPwd,
            validated: "not-validated",
        });

        let authToken;

        try {
            authToken = await authenticate(req);
        } catch (err) {
            // Expect token to not be defined
            expect(authToken).not.toBeDefined();
            // Expect error to has been thrown
            expect(err).toBeDefined();
            expect((err as Error).message).toBe("Account not validated");
        }

        expect(authToken).not.toBeDefined();
    });

    it("Authenticate OK, stayLogged : false", async () => {
        req.body = {
            email: "john.doe@authentication.com",
            password: "Abcdefgh1234!",
            stayLogged: false,
        };

        // Mock hashed password
        const hashedPwd = await bcrypt.hash(req.body.password, parseInt(String(process.env.SALT_ROUND)));

        // Mock database request
        Restaurant.findOne = jest.fn().mockResolvedValue({
            password: hashedPwd,
            validated: "true",
        });

        let authToken;

        try {
            authToken = await authenticate(req);
        } catch (err) {
            expect(err).not.toBeDefined();
        }

        const { iat, exp } = jwt.decode(String(authToken)) as TokenData;

        // Expect token to be defined
        expect(authToken).toBeDefined();
        // Expect to have 2h expiration
        expect(exp - iat).toBe(7200);
    });

    it("Authenticate OK, stayLogged : true", async () => {
        req.body = {
            email: "john.doe@authentication.com",
            password: "Abcdefgh1234!",
            stayLogged: true,
        };

        // Mock hashed password
        const hashedPwd = await bcrypt.hash(req.body.password, parseInt(String(process.env.SALT_ROUND)));

        // Mock database request
        Restaurant.findOne = jest.fn().mockResolvedValue({
            password: hashedPwd,
            validated: "true",
        });

        let authToken;

        try {
            authToken = await authenticate(req);
        } catch (err) {
            expect(err).not.toBeDefined();
        }

        const { exp } = jwt.decode(String(authToken)) as TokenData;

        // Expect token to be defined
        expect(authToken).toBeDefined();
        // Expect to have 2h expiration
        expect(exp).not.toBeDefined();
    });
});
