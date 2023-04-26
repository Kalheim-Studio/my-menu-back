import type { Request } from "express";
import jwt from "jsonwebtoken";
import deleteSubAccount from "./deleteSubAccount";
import { User } from "../../../../Models/User";

describe("deleteSubAccount service test", () => {
    // Mocking request
    const req = { body: {}, headers: {} } as Request;

    const authToken = jwt.sign(
        {
            restaurantId: "restaurantId",
        },
        "secrettokenkey"
    );

    req.headers = {
        authorization: "Bearer " + authToken,
    };

    /* #### TESTS #### */

    it("Should fail if no account has been found", async () => {
        User.findOne = jest.fn().mockResolvedValue(null);

        let error;

        try {
            await deleteSubAccount(req);
        } catch (err) {
            console.log((err as Error).name);
            error = err as Error;
        }

        // Expect no-account error to have been thrown
        expect(error).toBeDefined();
        expect((error as Error).name).toBe("no-account");
    });

    it("Should fail if account to delete has owner role", async () => {
        User.findOne = jest.fn().mockResolvedValue({
            role: "Owner",
        });

        let error;

        try {
            await deleteSubAccount(req);
        } catch (err) {
            error = err as Error;
        }

        // Expect owner-account error to have been thrown
        expect(error).toBeDefined();
        expect((error as Error).name).toBe("owner-account");
    });

    it("Should delete sub account", async () => {
        User.findOne = jest.fn().mockResolvedValue({
            role: "Manager",
        });

        User.deleteOne = jest.fn();

        let error;

        try {
            await deleteSubAccount(req);
        } catch (err) {
            error = err;
        }

        // Expect that no error has been thrown
        expect(error).toBeUndefined();
    });
});
