import type { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import checkAuth from "./checkAuth";

import { Restaurant } from "../../Models/Restaurant";

describe("checkAuth middleware test", () => {
    dotenv.config();

    const req: Request = { headers: {} } as Request;
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
    const next = jest.fn() as NextFunction;
    const errorMessage = "Authentication failed";
    const errorCode = 401;

    it("Checking expired token", async () => {
    // Generating expired 2h hours token (backdating it by 2.5h)
        const token = jwt.sign(
            { restaurantId: "restaurantId", iat: Math.floor(Date.now() / 1000) - 60 * 60 * 2.5 },
            String(process.env.TOKEN_KEY),
            {
                expiresIn: "2h",
            }
        );
        req.headers = {
            authToken: token,
        };

        await checkAuth(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(errorCode);
        expect(res.send).toHaveBeenCalledWith(errorMessage);
    });

    it("Checking token with unvalid secret key", async () => {
    // Generating a token with an unvalid secret key
        const token = jwt.sign({ restaurantId: "restaurantId" }, "Wrong_Secret_Key");
        req.headers = {
            authToken: token,
        };

        await checkAuth(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(errorCode);
        expect(res.send).toHaveBeenCalledWith(errorMessage);
    });

    it("Checking wrong format token", async () => {
    // Wrong format token
        req.headers = {
            authToken: "thisabadformattoken",
        };

        await checkAuth(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(errorCode);
        expect(res.send).toHaveBeenCalledWith(errorMessage);
    });

    it("Checking unknwon account", async () => {
        const authToken = jwt.sign({ restaurantId: "thisanunknownaccountid" }, String(process.env.TOKEN_KEY));
        // Unknwon account
        req.headers.authorization = "Bearer " + authToken;

        // Mock la recherche de compte dans la base de données
        Restaurant.findOne = jest.fn().mockResolvedValue(false);
        await checkAuth(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(errorCode);
        expect(res.send).toHaveBeenCalledWith(errorMessage);
    });

    it("Checking valid unlimitted token", async () => {
    // Generating unlimited valid token
        const authToken = jwt.sign({ restaurantId: "restaurantId" }, String(process.env.TOKEN_KEY));
        req.headers.authorization = "Bearer " + authToken;

        // Mock la recherche de compte dans la base de données
        Restaurant.findOne = jest.fn().mockResolvedValue(true);

        await checkAuth(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    it("Checking valid limited token", async () => {
    // Generatin 2 hours token
        const authToken = jwt.sign({ restaurantId: "restaurantId" }, String(process.env.TOKEN_KEY), {
            expiresIn: "2h",
        });
        req.headers.authorization = "Bearer " + authToken;

        // Mock la recherche de compte dans la base de données
        Restaurant.findOne = jest.fn().mockResolvedValue(true);

        await checkAuth(req, res, next);

        expect(next).toHaveBeenCalled();
    });
});
