import request from "supertest";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { Restaurant } from "../../../../Models/Restaurant";
import { User } from "../../../../Models/User";
import app from "../../../../app";

describe("getAllAccountsByRestaurantId controller test", () => {
    dotenv.config();

    let restaurantId: string;

    beforeAll(async () => {
        await mongoose.connect(String(process.env.DATABASE_URI));
        // Mocking main account
        const newRestaurant = new Restaurant({
            name: "John's Dinner",
            address: "123 Sesame street",
            postalCode: "01234",
            city: "laputa",
            phone: "(+33)102030405",
            email: "johnsdinner@all-account.com",
            password: "Abcdefgh1234!",
            validated: "true",
        });
        await newRestaurant.save();

        restaurantId = String(newRestaurant._id);

        // Mocking sub account
        const firstUser = new User({
            identifier: "John_Doe_" + restaurantId,
            firstname: "John",
            lastname: "Doe",
            password: "Abcdefgh1234!",
            restaurantId: restaurantId,
            role: "Owner",
        });
        await firstUser.save();

        const secondUser = new User({
            identifier: "Jane_Doe_" + restaurantId,
            firstname: "Jane",
            lastname: "Doe",
            password: "Abcdefgh1234!",
            restaurantId: restaurantId,
            role: "Manager",
        });
        await secondUser.save();

        const thirdUser = new User({
            identifier: "Billy_Doe_" + restaurantId,
            firstname: "Billy",
            lastname: "Doe",
            password: "Abcdefgh1234!",
            restaurantId: restaurantId,
            role: "Waiter",
        });
        await thirdUser.save();
    });

    afterAll(async () => {
    // Deleteing mocked data
        await User.deleteMany({ restaurantId: restaurantId });
        await Restaurant.deleteOne({ _id: restaurantId });
        await mongoose.disconnect();
    });

    it("Should send error if bad authentication", async () => {
        const authToken = jwt.sign({ restaurantId: "thisisabadtoken" }, String(process.env.TOKEN_KEY));

        const response = await request(app).get("/user/accounts-by-rest-id").set("token", authToken);

        expect(response.status).toBe(400);
        expect(response.text).toBe("Authentication failed");
    });

    it("Should get all account by res Id", async () => {
        const authToken = jwt.sign({ restaurantId: restaurantId }, String(process.env.TOKEN_KEY));

        const response = await request(app).get("/user/accounts-by-rest-id").set("token", authToken);

        expect(response.status).toBe(200);
        // Expect to not have Owner account
        expect(response.body.subAccounts.length).toEqual(2);
        // Check Result
        expect(response.body.subAccounts[0].identifier).toBe("Jane_Doe_" + restaurantId);
        expect(response.body.subAccounts[1].identifier).toBe("Billy_Doe_" + restaurantId);
    });
});
