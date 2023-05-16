import type { Request, Response } from "express";
import { userController } from "./userController";

/* #### Mocking services function #### */
function mockedService() {
    return jest.fn().mockImplementation((req: Request) => {
        if (req.body.errorName) throw new Error("This is an error");
    });
}

// registerAccount
jest.mock("./services/registerAccount/registerAccount", () => ({
    registerAccount: mockedService(),
}));

// validateAccount
jest.mock("./services/validateAccount/validateAccount", () => ({
    validateAccount: mockedService(),
}));

// authenticate
jest.mock("./services/authenticate/authenticate", () => ({
    authenticate: jest.fn().mockImplementation((req: Request) => {
        if (req.body.errorName) throw new Error("This is an error");
        else return "authToken";
    }),
}));

// createSubAccount
jest.mock("./services/createSubAccount/createSubAccount", () => ({
    createSubAccount: jest.fn().mockImplementation((req: Request) => {
        if (req.body.errorName === "duplicate-account") {
            const error = new Error("This is an error");
            error.name = "duplicate-account";
            throw error;
        } else if (req.body.errorName) throw new Error("This is an error");
    }),
}));

// getAllAccountsByRestaurantId
jest.mock("./services/getAllAccountsByRestaurantId/getAllAccountsByRestaurantId", () => ({
    getAllAccountsByRestaurantId: jest.fn().mockImplementation((req: Request) => {
        if (req.body.errorName) throw new Error("This is an error");
        else return ["some results"];
    }),
}));

// deleteSubAccount
jest.mock("./services/deleteSubAccount/deleteSubAccount", () => ({
    deleteSubAccount: jest.fn().mockImplementation((req: Request) => {
        if (req.body.errorName === "no-account") {
            const error = new Error("This is an error");
            error.name = "no-account";
            throw error;
        } else if (req.body.errorName) throw new Error("This is an error");
    }),
}));

// getAccountInfo
jest.mock("./services/getAccountInfo/getAccountInfo", () => ({
    getAccountInfo: jest.fn().mockImplementation((req: Request) => {
        if (req.body.errorName) throw new Error("This is an error");
        else return { accountInfos: "some infos" };
    }),
}));

// resetPassword
jest.mock("./services/resetPassword/resetPassword", () => ({
    resetPassword: mockedService(),
}));

// changePassword
jest.mock("./services/changePassword/changePassword", () => ({
    changePassword: mockedService(),
}));

/* Test Method */

describe("user controller test", () => {
    const req = { body: {} } as Request;
    const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        json: jest.fn(),
    };
    const res = mockResponse as Response;

    // Reset mock rea & res
    beforeEach(() => {
        req.body.errorName = "";
        (res.json as jest.Mock).mockReset();
    });

    /* #### TESTS #### */

    // registerAccount
    it("Should send error on registerAccount", async () => {
        req.body.errorName = "some-error";

        await userController.registerAccount(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith("Error while registering");
    });

    it("Should send Ok response on registerAccount", async () => {
        await userController.registerAccount(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith("Account created");
    });

    // validateAccount
    it("Should send error on validateAccount", async () => {
        req.body.errorName = "some-error";

        await userController.validateAccount(req, res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.send).toHaveBeenCalledWith("No account to validate has been found");
    });

    it("Should send Ok response on validateAccount", async () => {
        await userController.validateAccount(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith("Account has been validated");
    });

    // authenticate
    it("Should send error on authenticate", async () => {
        req.body.errorName = "some-error";

        await userController.authenticate(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith("This is an error");
    });

    it("Should send Ok response on authenticate", async () => {
        await userController.authenticate(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ token: "authToken" });
    });

    // checkAuthenticated
    it("Should response authenticate: true ", async () => {
        await userController.checkAuthenticated(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ authenticated: true });
    });

    // createSubAccount
    it("Should send duplicate-account error on createSubAccount", async () => {
        req.body.errorName = "duplicate-account";

        await userController.createSubAccount(req, res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.send).toHaveBeenCalledWith("Error while registering.");
    });

    it("Should send error on createSubAccount", async () => {
        req.body.errorName = "some-error";

        await userController.createSubAccount(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith("Error while registering.");
    });

    it("Should send Ok response on createSubAccount", async () => {
        await userController.createSubAccount(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith("Account Created");
    });

    // getAllAccountsByRestaurantId
    it("Should send error on getAllAccountsByRestaurantId", async () => {
        req.body.errorName = "some-error";

        await userController.getAllAccountsByRestaurantId(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith("Request error");
    });

    it("Should send Ok response on getAllAccountsByRestaurantId", async () => {
        await userController.getAllAccountsByRestaurantId(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ subAccounts: ["some results"] });
    });

    // deleteSubAccount
    it("Should send no-account error on deleteSubAccount", async () => {
        req.body.errorName = "no-account";

        await userController.deleteSubAccount(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith("This is an error");
    });

    it("Should send error on deleteSubAccount", async () => {
        req.body.errorName = "some-error";

        await userController.deleteSubAccount(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith("Error while deleting account");
    });

    it("Should send Ok response on deleteSubAccount", async () => {
        await userController.deleteSubAccount(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith("Account deleted");
    });

    // getAccountInfo
    it("Should send error on getAccountInfo", async () => {
        req.body.errorName = "some-error";

        await userController.getAccountInfo(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith("This is an error");
    });

    it("Should send Ok response on getAccountInfo", async () => {
        await userController.getAccountInfo(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ accountInfos: "some infos" });
    });

    // resetPassword
    it("Should send error on resetPassword", async () => {
        req.body.errorName = "some-error";

        await userController.resetPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith("This is an error");
    });

    it("Should send Ok response on resetPassword", async () => {
        await userController.resetPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith("Reset password mail has been sent");
    });

    // changePassword
    it("Should send error on changePassword", async () => {
        req.body.errorName = "some-error";

        await userController.changePassword(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith("This is an error");
    });

    it("Should send Ok response on changePassword", async () => {
        await userController.changePassword(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith("Password changed");
    });
});
