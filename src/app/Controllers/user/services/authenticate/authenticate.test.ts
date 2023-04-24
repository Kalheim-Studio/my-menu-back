import type { Request } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Restaurant } from "../../../../Models/Restaurant";
import authenticate from "./authenticate";
import AuthToken from "../../../../Types/AuthToken";

describe("Testing authenticate controller", () => {
    const req: Request = { body: {} } as Request;
    const salt_round = 1;

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
        let error;

        try {
            authToken = await authenticate(req);
        } catch (err) {
            error = err;
        }

        // Expect token to not be defined
        expect(authToken).toBeUndefined();
        // Expect error to has been thrown
        expect(error).toBeDefined();
        expect((error as Error).message).toBe("Login or password incorrect");
    });

    it("Should throw error if account not validated", async () => {
    // Mock request body
        req.body = {
            email: "john.doe@authentication.com",
            password: "Abcdefgh1234!",
            stayLogged: true,
        };

        // Mock hashed password
        const hashedPwd = await bcrypt.hash(req.body.password, salt_round);

        // Mock database request
        Restaurant.findOne = jest.fn().mockResolvedValue({
            password: hashedPwd,
            validated: "not-validated",
        });

        let authToken;
        let error;

        try {
            authToken = await authenticate(req);
        } catch (err) {
            error = err;
        }

        // Expect token to not be defined
        expect(authToken).toBeUndefined();
        // Expect error to has been thrown
        expect(error).toBeDefined();
        expect((error as Error).message).toBe("Account not validated");
    });

    it("Authenticate OK, stayLogged : false", async () => {
        req.body = {
            email: "john.doe@authentication.com",
            password: "Abcdefgh1234!",
            stayLogged: false,
        };

        // Mock hashed password
        const hashedPwd = await bcrypt.hash(req.body.password, salt_round);

        // Mock database request
        Restaurant.findOne = jest.fn().mockResolvedValue({
            password: hashedPwd,
            validated: "true",
        });

        let authToken;
        let error;

        try {
            authToken = await authenticate(req);
        } catch (err) {
            error = err;
        }

        const { iat, exp } = jwt.decode(String(authToken)) as AuthToken;

        // Expect error to has not been thrown
        expect(error).toBeUndefined();
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
        const hashedPwd = await bcrypt.hash(req.body.password, salt_round);

        // Mock database request
        Restaurant.findOne = jest.fn().mockResolvedValue({
            password: hashedPwd,
            validated: "true",
        });

        let authToken;
        let error;

        try {
            authToken = await authenticate(req);
        } catch (err) {
            error = err;
        }

        const { exp } = jwt.decode(String(authToken)) as AuthToken;

        // Expect error to has not been thrown
        expect(error).toBeUndefined();
        // Expect token to be defined
        expect(authToken).toBeDefined();
        // Expect to have 2h expiration
        expect(exp).toBeUndefined();
    });
});
