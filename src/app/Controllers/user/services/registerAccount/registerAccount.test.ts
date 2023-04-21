import type { Request } from "express";
import { Restaurant } from "../../../../Models/Restaurant";
import { User } from "../../../../Models/User";
import { sendAccountValidationMail } from "../../../../../Utils/mailing/mailing";
import registerAccount from "./registerAccount";

// Mocking send email funtion
jest.mock("../../../../../Utils/mailing/mailing", () => ({
    sendAccountValidationMail: jest.fn().mockResolvedValue(undefined),
}));

describe("Testing registerAccount controller", () => {
    const req = { body: {} } as Request;

    it("Should fail if user missing", async () => {
    // Mocking req.body
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

        let error;

        try {
            await registerAccount(req);
        } catch (err) {
            error = err;
            // Check mail not sended
            expect(sendAccountValidationMail).not.toHaveBeenCalled();
        }

        // Expect error to has been thrown
        expect(error).toBeDefined();
        expect((error as Error).message).toBe("Error while registering");
    });

    it("Should fail if restaurant missing", async () => {
    // Mocking req.body
        req.body = {
            identifier: "John_Doe",
            firstname: "John",
            lastname: "Doe",
        };

        try {
            await registerAccount(req);
        } catch (err) {
            // Expect error to has been thrown
            expect(err).toBeDefined();
            expect((err as Error).message).toBe("Error while registering");

            // Check mail not sended
            expect(sendAccountValidationMail).not.toHaveBeenCalled();
        }
    });

    it("Should failed if account already exist", async () => {
    // Mocking saving models function

    interface DuplicateKeyError extends Error {
      code: number;
    }

    Restaurant.prototype.save = jest.fn(() => {
        const error = new Error() as DuplicateKeyError;
        error.code = 11000;
        throw error;
    });

    // Mocking req.body
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

    try {
        await registerAccount(req);
    } catch (err) {
        // Expect error to has been thrown
        expect(err).toBeDefined();
        expect((err as DuplicateKeyError).code).toBe(11000);

        // Check mail not sended
        expect(sendAccountValidationMail).not.toHaveBeenCalled();
    }
    });

    it("Should register new account", async () => {
    // Mocking saving models function
        Restaurant.prototype.save = jest.fn();
        User.prototype.save = jest.fn();

        // Mocking req.body
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

        try {
            await registerAccount(req);
            // Expect data registered
            expect(Restaurant.prototype.save).toHaveBeenCalled();
            expect(User.prototype.save).toHaveBeenCalled();
            // Check mail sended
            expect(sendAccountValidationMail).toHaveBeenCalled();
        } catch (err) {
            // Expect error to has been not thrown
            expect(err).not.toBeDefined();
        }
    });
});
