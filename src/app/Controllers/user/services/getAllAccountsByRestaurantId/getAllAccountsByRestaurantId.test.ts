import type { Request } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { User } from "../../../../Models/User";
import getAllAccountsByRestaurantId from "./getAllAccountsByRestaurantId";

describe("getAllAccountsByRestaurantId controller test", () => {
    dotenv.config();
    const req = { headers: {} } as Request;

    it("Should get all account by res Id", async () => {
    // Mocking restaurantId in request authorization
        const authToken = jwt.sign(
            {
                restaurantId: "restaurantId",
            },
            String(process.env.TOKEN_KEY)
        );

        req.headers = {
            authorization: "Bearer " + authToken,
        };

        // Mocking database read function
        User.find = jest.fn().mockResolvedValue("Seme results");

        let error;
        let results;

        try {
            results = await getAllAccountsByRestaurantId(req);
        } catch (err) {
            error = err;
        }

        // Expect error to has not been thrown
        expect(error).not.toBeDefined();
        // Expect some results to has been return
        expect(results).toBeDefined();
    });
});
