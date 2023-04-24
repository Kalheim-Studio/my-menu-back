import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import checkAuth from "./checkAuth";

import { Restaurant } from "../../Models/Restaurant";

describe("checkAuth middleware test", () => {
    const req: Request = { headers: {} } as Request;
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
    const next = jest.fn() as NextFunction;
    const errorMessage = "Authentication failed";
    const errorCode = 401;

    it("Should fail if expired token", async () => {
    // Generating expired 2h hours token (backdating it by 2.5h)
        const token = jwt.sign(
            { restaurantId: "restaurantId", iat: Math.floor(Date.now() / 1000) - 60 * 60 * 2.5 },
            "secrettokenkey",
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

    it("Should fail if token with unvalid secret key", async () => {
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

    it("Should fail if wrong format token", async () => {
    // Wrong format token
        req.headers = {
            authToken: "thisabadformattoken",
        };

        await checkAuth(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(errorCode);
        expect(res.send).toHaveBeenCalledWith(errorMessage);
    });

    it("Should fail if no account has been found", async () => {
        process.env.TOKEN_KEY = "secrettokenkey";
        const authToken = jwt.sign({ restaurantId: "thisanunknownaccountid" }, "secrettokenkey");

        // Unknwon account
        req.headers.authorization = "Bearer " + authToken;

        // Mock la recherche de compte dans la base de données
        Restaurant.findOne = jest.fn().mockResolvedValue(false);
        await checkAuth(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(errorCode);
        expect(res.send).toHaveBeenCalledWith(errorMessage);
    });

    it("Should fail if unvalidated account", async () => {
        process.env.TOKEN_KEY = "secrettokenkey";
        const authToken = jwt.sign({ restaurantId: "thisanunvalidatedaccountid" }, "secrettokenkey");

        // Unknwon account
        req.headers.authorization = "Bearer " + authToken;

        // Mock la recherche de compte dans la base de données
        Restaurant.findOne = jest.fn().mockResolvedValue({ validated: "unvalidated" });
        await checkAuth(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(errorCode);
        expect(res.send).toHaveBeenCalledWith(errorMessage);
    });

    it("Should grant access if valid unlimitted token", async () => {
        process.env.TOKEN_KEY = "secrettokenkey";

        // Generating unlimited valid token
        const authToken = jwt.sign({ restaurantId: "restaurantId" }, "secrettokenkey");
        req.headers.authorization = "Bearer " + authToken;

        // Mock la recherche de compte dans la base de données
        Restaurant.findOne = jest.fn().mockResolvedValue({ validated: "true" });

        await checkAuth(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    it("Should grant access if valid limited token", async () => {
        process.env.TOKEN_KEY = "secrettokenkey";
        // Generatin 2 hours token
        const authToken = jwt.sign({ restaurantId: "restaurantId" }, "secrettokenkey", {
            expiresIn: "2h",
        });
        req.headers.authorization = "Bearer " + authToken;

        // Mock la recherche de compte dans la base de données
        Restaurant.findOne = jest.fn().mockResolvedValue({ validated: "true" });

        await checkAuth(req, res, next);

        expect(next).toHaveBeenCalled();
    });
});
