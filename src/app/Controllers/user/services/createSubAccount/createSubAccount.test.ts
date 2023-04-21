import dotenv from "dotenv";
import type { Request } from "express";
import jwt from "jsonwebtoken";
import createSubAccount from "./createSubAccount";
import { User } from "../../../../Models/User";

describe("createSubAccount controller test", () => {
    dotenv.config();

    // Mocking request
    const req = { body: {}, headers: {} } as Request;

    // Mocking database create function
    User.prototype.save = jest.fn();

    beforeEach(() => {
    // Mocking Data
        req.body = {
            identifier: "John_Doe",
            firstname: "John",
            lastname: "Doe",
            password: "Abcdefgh1234!",
            role: "Manager",
        };

        const authToken = jwt.sign(
            {
                restaurantId: "restaurantId",
            },
            String(process.env.TOKEN_KEY)
        );

        req.headers = {
            authorization: "Bearer " + authToken,
        };
    });

    it("Should response error if role is owner", async () => {
        req.body.role = "Owner";
        let error;

        try {
            await createSubAccount(req);
        } catch (err) {
            error = err;
        }

        // Expect error to has been thrown
        expect(error).toBeDefined();
        expect((error as Error).message).toBe("Can't create sub account with Owner role");
    });

    it("Should response error if missing Data", async () => {
        req.body = {
            identifier: "John_Doe",
            firstname: "John",
            lastname: "Doe",
            role: "Manager",
        };

        let error;

        try {
            await createSubAccount(req);
        } catch (err) {
            error = err;
        }

        // Expect error to has been thrown
        expect(error).toBeDefined();
        expect((error as Error).message).toBe("Error on new account data field");
    });

    it("Should register new sub account", async () => {
        let error;

        try {
            await createSubAccount(req);
        } catch (err) {
            error = err;
        }

        // Expect error to has not been thrown
        expect(error).not.toBeDefined();
    });
});
