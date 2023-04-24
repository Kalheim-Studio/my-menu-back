import type { Request } from "express";
import { Restaurant } from "../../../../Models/Restaurant";
import validateAccount from "./validateAccount";

describe("Testing validateAccount controller", () => {
    // Mocking request
    const req: Request = { params: {} } as Request;
    req.params = {
        token: "thisisatoken",
    };

    it("Should throw error if no account to validate", async () => {
    // Mocking failure update
        Restaurant.updateOne = jest.fn().mockResolvedValue({
            modifiedCount: 0,
        });

        let error;

        try {
            await validateAccount(req);
        } catch (err) {
            error = err;
        }

        // Expect error to has been thrown
        expect(error).toBeDefined();
        expect((error as Error).message).toBe("No account to validate have been found");
    });

    it("Should validate new account", async () => {
    // Mocking succesfull update
        Restaurant.updateOne = jest.fn().mockResolvedValue({
            modifiedCount: 1,
        });

        let error;

        try {
            await validateAccount(req);
        } catch (err) {
            error = err;
        }

        // Error must not be throw
        expect(error).toBeUndefined();
    });
});
