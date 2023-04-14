import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import checkAuth from "./checkAuth";

describe("checkAuth middleware test", () => {
    const req: Request = { headers: {} } as Request;
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
    const next = jest.fn() as NextFunction;
    const errorMessage = "Authentication failed";

    it("Checking valid unlimitted token", () => {
    // Generating unlimited valid token
        const token = jwt.sign({ restaurantId: "FakRestaurantId" }, String(process.env.TOKEN_KEY));
        req.headers = {
            token: token,
        };

        checkAuth(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    it("Checking valid limited token", () => {
    // Generatin 2 hours token
        const token = jwt.sign({ restaurantId: "FakeRestaurantId" }, String(process.env.TOKEN_KEY), {
            expiresIn: "2h",
        });
        req.headers = {
            token: token,
        };

        checkAuth(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    it("Checking expired token", () => {
    // Generating expired 2h hours token (backdating it by 2.5h)
        const token = jwt.sign(
            { restaurantId: "FakeRestaurantId", iat: Math.floor(Date.now() / 1000) - 60 * 60 * 2.5 },
            String(process.env.TOKEN_KEY),
            {
                expiresIn: "2h",
            }
        );
        req.headers = {
            token: token,
        };

        checkAuth(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(errorMessage);
    });

    it("Checking token with unvalid secret key", () => {
    // Generating a token with an unvalid secret key
        const token = jwt.sign({ restaurantId: "FakRestaurantId" }, "Wrong_Secret_Key");
        req.headers = {
            token: token,
        };

        checkAuth(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(errorMessage);
    });

    it("Checking wrong token", () => {
    // Wrong format token
        req.headers = {
            token: "thisabadformattoken",
        };

        checkAuth(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(errorMessage);
    });
});
