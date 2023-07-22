import type { Request } from "express";
import jwt from "jsonwebtoken";
import { Restaurant } from "../../../../Models/Restaurant";
import { getAccountInfo } from "./getAccountInfo";

describe("getAccountInfo service test", () => {
    // Mocking request
    const req = { headers: {} } as Request;
    const authToken = jwt.sign(
        {
            restaurantId: "64ac497ec46ef4d28a0801e9",
            role: "Owner"
        },
        "secrettokenkey"
    );

    req.headers = {
        authorization: "Bearer " + authToken,
    };

    /* #### TESTS #### */
    it("Should fail if there's no account", async () => {
    // Mocking database read functions
        Restaurant.aggregate = jest.fn().mockResolvedValueOnce([]);
        
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

    it("Should get owner account info", async () => {
    // Mocking database read functions
        Restaurant.aggregate = jest.fn().mockResolvedValueOnce([{
            name: "name",
            siret: "thisASiret",
            address: "address",
            postalCode: "postalCode",
            city: "city",
            phone: "phone",
            email: "email",
            table: ["table"],
            results: [{
                identifier: "identifier",
                firstname: "firstname",
                lastname: "lastname",
                role: "Owner"
            }]
        }]);

        let result;
        let error;

        try {
            result = await getAccountInfo(req);
        } catch (err) {
            error = err;
        }

        expect(error).toBeUndefined();
        expect(result).toEqual({
            user: {
                identifier: "identifier",
                firstname: "firstname",
                lastname: "lastname",
                role: "Owner"
            },
            restaurant: {
                name: "name",
                siret: "thisASiret",
                address: "address",
                postalCode: "postalCode",
                city: "city",
                phone: "phone",
                email: "email",
                table: ["table"],
            },
        });
    });
});
