import request from "supertest";
import { Request, Response, NextFunction } from "express";
import app from "../../app";

// Mocking checkData middleware
jest.mock("../../Middlewares/checkAuth/checkAuth", () => {
    return jest.fn().mockImplementation((req: Request, res: Response, next: NextFunction) => next());
});

// Mocking checkData middleware
jest.mock("../../Middlewares/checkData/checkData", () => {
    return jest.fn().mockImplementation((req: Request, res: Response, next: NextFunction) => next());
});

// Mocking User controller
const statusCode = 200;
const message = "Route OK";
function mockedControllerFunction(req: Request, res: Response) {
    res.status(statusCode).send(message);
}

jest.mock("../../Controllers/user/user", () => {
    return {
        registerAccount: jest.fn().mockImplementation(mockedControllerFunction),
        validateAccount: jest.fn().mockImplementation(mockedControllerFunction),
        authenticate: jest.fn().mockImplementation(mockedControllerFunction),
        checkAuthenticated: jest.fn().mockImplementation(mockedControllerFunction),
        createSubAccount: jest.fn().mockImplementation(mockedControllerFunction),
        getAllAccountsByRestaurantId: jest.fn().mockImplementation(mockedControllerFunction),
        deleteSubAccount: jest.fn().mockImplementation(mockedControllerFunction),
        getAccountInfo: jest.fn().mockImplementation(mockedControllerFunction),
        resetPassword: jest.fn().mockImplementation(mockedControllerFunction),
        changePassword: jest.fn().mockImplementation(mockedControllerFunction),
    };
});

/* #### TEST #### */

describe("UserRouter test", () => {
    it("Should response on route post user/register", async () => {
        const response = await request(app).post("/user/register");

        expect(response.statusCode).toBe(statusCode);
        expect(response.text).toEqual(message);
    });

    it("Should response on route put user/validate-account/:token", async () => {
        const response = await request(app).put("/user/validate-account/authToken");

        expect(response.statusCode).toBe(statusCode);
        expect(response.text).toEqual(message);
    });

    it("Should response on route post user/authenticate", async () => {
        const response = await request(app).post("/user/authenticate");

        expect(response.statusCode).toBe(statusCode);
        expect(response.text).toEqual(message);
    });

    it("Should response on route get user/check-authenticated", async () => {
        const response = await request(app).get("/user/check-authenticated");

        expect(response.statusCode).toBe(statusCode);
        expect(response.text).toEqual(message);
    });

    it("Should response on route post user/create-sub-account", async () => {
        const response = await request(app).post("/user/create-sub-account");

        expect(response.statusCode).toBe(statusCode);
        expect(response.text).toEqual(message);
    });

    it("Should response on route get user/accounts-by-rest-id", async () => {
        const response = await request(app).get("/user/accounts-by-rest-id");

        expect(response.statusCode).toBe(statusCode);
        expect(response.text).toEqual(message);
    });

    it("Should response on route delete user/delete-sub-account", async () => {
        const response = await request(app).delete("/user/delete-sub-account");

        expect(response.statusCode).toBe(statusCode);
        expect(response.text).toEqual(message);
    });

    it("Should response on route get user/get-account-info", async () => {
        const response = await request(app).get("/user/get-account-info");

        expect(response.statusCode).toBe(statusCode);
        expect(response.text).toEqual(message);
    });

    it("Should response on route get user/reset-password", async () => {
        const response = await request(app).get("/user/reset-password");

        expect(response.statusCode).toBe(statusCode);
        expect(response.text).toEqual(message);
    });

    it("Should response on route put user/change-password/:token", async () => {
        const response = await request(app).put("/user/change-password/resetToken");

        expect(response.statusCode).toBe(statusCode);
        expect(response.text).toEqual(message);
    });
});
