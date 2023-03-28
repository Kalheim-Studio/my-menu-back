import type { Request, Response, NextFunction } from "express";
import checkData from "./checkData";

describe("checkData middleware test", () => {
    const req: Request = { body: {} } as Request;
    let res = {} as Response;
    let next = jest.fn() as NextFunction;
    const errorMessage = "Error: Data are not valid.";

    // Mocking req, res and next before each test
    beforeEach(() => {
        req.body = {
            firstname: "John",
            lastname: "Doe",
            email: "john.doe@mock.com",
            password: "Abcdefgh1234!",
            restaurant: {
                name: "John's Dinner",
                address: "123 Sesame street",
                postalCode: "01234",
                city: "laputa",
                phone: "(+33)102030405",
                email: "contact@johnsdinner.com",
            },
        };

        res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
        next = jest.fn();
    });

    // Valid Data
    it("should be valid data", () => {
        checkData(req, res, next);
        // Expect next has been call with valid data
        expect(next).toHaveBeenCalledWith();
    });

    // Wrong firstname
    it("Should send error if bad firstname", () => {
        req.body.firstname = 1;

        checkData(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(errorMessage);
    });

    // Wrong lastname
    it("Should send error if bad lastname", () => {
        req.body.lastname = 1;

        checkData(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(errorMessage);
    });

    // Wrong email
    it("Should send error if bad email", () => {
        req.body.email = "john.doemock.com";

        checkData(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(errorMessage);
    });

    // Wrong password
    it("Should send error if bad password", () => {
        req.body.email = "123";

        checkData(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(errorMessage);
    });

    // Wrong name
    it("Should send error if bad name", () => {
        req.body.restaurant.name = 1;

        checkData(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(errorMessage);
    });

    // Wrong address
    it("Should send error if bad address", () => {
        req.body.restaurant.address = 1;

        checkData(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(errorMessage);
    });

    // Wrong postal code
    it("Should send error if bad postal code", () => {
        req.body.restaurant.postalCode = "0611";

        checkData(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(errorMessage);
    });

    // Wrong city
    it("Should send error if bad city", () => {
        req.body.restaurant.city = 1;
        checkData(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(errorMessage);
    });

    // Wrong phone
    it("Should send error if bad phone", () => {
        req.body.restaurant.email = "1123456789";

        checkData(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(errorMessage);
    });

    // Not allowed data field
    it("Should send error if additionnal", () => {
        req.body.additionalData = "Additionnal data";

        checkData(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(errorMessage);
    });

    // Missing dataField
    it("Should send error if additionnal", () => {
    // firstname missing
        req.body = {
            lastname: "Doe",
            email: "john.doe@mock.com",
            password: "Abcdefgh1234!",
            restaurant: {
                name: "John's Dinner",
                address: "123 Sesame street",
                postalCode: "01234",
                city: "laputa",
                phone: "(+33)102030405",
                email: "contact@johnsdinner.com",
            },
        };

        // Setting user/register
        req.originalUrl = "/user/register";

        checkData(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(errorMessage);
    });
});
