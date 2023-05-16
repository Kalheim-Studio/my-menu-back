import type { Request } from "express";
import jwt from "jsonwebtoken";
import { User } from "../../../../Models/User";
import { getAllAccountsByRestaurantId } from "./getAllAccountsByRestaurantId";

describe("getAllAccountsByRestaurantId service test", () => {
    const req = { headers: {} } as Request;

    it("Should get all account by res Id", async () => {
    // Mocking restaurantId in request authorization
        const authToken = jwt.sign(
            {
                restaurantId: "restaurantId",
            },
            "secrettokenkey"
        );

        req.headers = {
            authorization: "Bearer " + authToken,
        };

        // Mocking database read function
        User.find = jest.fn().mockResolvedValue("Some results");

        let error;
        let results;

        try {
            results = await getAllAccountsByRestaurantId(req);
        } catch (err) {
            error = err;
        }

        // Expect error to has not been thrown
        expect(error).toBeUndefined();
        // Expect some results to has been return
        expect(results).toBeDefined();
    });
});
