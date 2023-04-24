import type { Request } from "express";
import jwt from "jsonwebtoken";
import { User } from "../../../../Models/User";
import { Restaurant } from "../../../../Models/Restaurant";
import getAccountInfo from "./getAccountInfo";

describe("getAccountInfo controller test", () => {
    // Mocking request
    const req = { headers: {} } as Request;
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
    it("Should fail if there's no account", async () => {
    // Mocking database read functions
        User.findOne = jest.fn().mockResolvedValue(null);

        Restaurant.findOne = jest.fn().mockResolvedValue(null);

        let result;
        let error;

        try {
            result = await getAccountInfo(req);
        } catch (err) {
            error = err;
        }

        expect(result).toBeUndefined();
        expect(error).toBeDefined();
        expect((error as Error).message).toBe("No account has been found");
    });

    it("Should get account info", async () => {
    // Mocking database read functions
        User.findOne = jest.fn().mockResolvedValue({
            identifier: "identifier",
            firstname: "firstname",
            lastname: "lastname",
        });

        Restaurant.findOne = jest.fn().mockResolvedValue({
            name: "name",
            address: "address",
            postalCode: "postalCode",
            city: "city",
            phone: "phone",
            email: "email",
            table: "table",
        });

        let result;
        let error;

        try {
            result = await getAccountInfo(req);
        } catch (err) {
            error = err;
        }
        console.log(typeof result, result);

        expect(error).not.toBeDefined();
        expect(result).toEqual({
            owner: {
                identifier: "identifier",
                firstname: "firstname",
                lastname: "lastname",
            },
            restaurant: {
                name: "name",
                address: "address",
                postalCode: "postalCode",
                city: "city",
                phone: "phone",
                email: "email",
                table: "table",
            },
        });
    });
});
