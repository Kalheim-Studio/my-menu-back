import type { Request, Response, NextFunction } from "express";
import checkData from "./checkData";

describe("checkData middleware test", () => {
    const req: Request = { body: {} } as Request;
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;
    const next = jest.fn() as NextFunction;
    const errorMessage = "Error: Data are not valid.";

    // Valid Data
    it("should be valid data", () => {
        req.body = {
            identifier: "John_Doe",
            firstname: "John",
            lastname: "Doe",
            email: "john.doe@mock.com",
            restaurant: {
                name: "John's Dinner",
                address: "123 Sesame street",
                postalCode: "01234",
                city: "laputa",
                phone: "(+33)102030405",
                email: "contact@johnsdinner.com",
                password: "Abcdefgh1234!",
            },
        };

        checkData(req, res, next);
        // Expect next has been call with valid data
        expect(next).toHaveBeenCalledWith();
    });

    // Wrong email
    it("Should send error if bad email", () => {
        req.body = {
            email: "john.doemock.com",
        };

        checkData(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(errorMessage);
    });

    // Wrong password
    it("Should send error if bad password", () => {
        req.body = {
            password: "123",
        };

        checkData(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(errorMessage);
    });

    // Wrong phone
    it("Should send error if bad phone", () => {
        req.body = {
            phone: "1123456789",
        };

        checkData(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(errorMessage);
    });

    // Wrong postal code
    it("Should send error if bad postal code", () => {
        req.body = {
            postalCode: "0611",
        };
        checkData(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(errorMessage);
    });

    // Wrong identifier
    it("Should send error if bad identifier", () => {
        req.body = {
            identifier: 1,
        };

        checkData(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(errorMessage);
    });

    // Wrong firstname
    it("Should send error if bad firstname", () => {
        req.body = {
            firstname: 1,
        };

        checkData(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(errorMessage);
    });

    // Wrong lastname
    it("Should send error if bad lastname", () => {
        req.body = {
            lastname: 1,
        };
        checkData(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(errorMessage);
    });

    // Wrong name
    it("Should send error if bad name", () => {
        req.body = {
            name: 1,
        };

        checkData(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(errorMessage);
    });

    // Wrong address
    it("Should send error if bad address", () => {
        req.body = {
            address: 1,
        };

        checkData(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(errorMessage);
    });

    // Wrong city
    it("Should send error if bad city", () => {
        req.body = {
            city: 1,
        };

        checkData(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(errorMessage);
    });

    // Not allowed data field
    it("Should send error if additionnal data", () => {
        req.body = {
            additionalData: "Additionnal data",
        };

        checkData(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(errorMessage);
    });

    // sanitize data
    it("Should sanitize data", () => {
    //&lt;b&gt;John&lt;&#x2F;b&gt;
        req.body = {
            firstname: "<b>John</b>",
        };

        checkData(req, res, next);

        // Expect next has been call and data has been sanitized.
        expect(next).toHaveBeenCalledWith();
        expect(req.body.firstname).toBe("&lt;b&gt;John&lt;&#x2F;b&gt;");
    });
});
