import type { Request, Response } from "express";
// Services
import registerAccount from "./services/registerAccount/registerAccount";
import validateAccount from "./services/validateAccount/validateAccount";
import authenticate from "./services/authenticate/authenticate";
import createSubAccount from "./services/createSubAccount/createSubAccount";
import getAllAccountsByRestaurantId from "./services/getAllAccountsByRestaurantId/getAllAccountsByRestaurantId";
import deleteSubAccount from "./services/deleteSubAccount";
import getAccountInfo from "./services/getAccountInfo";
import resetPassword from "./services/resetPassword";
import changePassword from "./services/changePassword";
// Utils
import { logger } from "../../../Utils/logger/logger";

const User = {
    // Account registration
    registerAccount: async (req: Request, res: Response) => {
        try {
            await registerAccount(req);
            res.status(201).send("Account created");
        } catch (err) {
            logger(__dirname, "Error", { errorMessage: (err as Error).message });
            res.status(500).send("Error while registering");
        }
    },
    // Account Validation
    validateAccount: async (req: Request, res: Response) => {
        try {
            await validateAccount(req);
            res.status(200).send("Account has been validated");
        } catch (err) {
            logger(__dirname, "Error", { errorMessage: (err as Error).message });
            res.status(409).send("No account to validate has been found");
        }
    },
    // User authentication
    authenticate: async (req: Request, res: Response) => {
        try {
            const authToken = await authenticate(req);
            res.status(200).json({
                token: authToken,
            });
        } catch (err) {
            logger(__dirname, "Error", { errorMessage: (err as Error).message });
            res.status(401).send((err as Error).message);
        }
    },
    // Sub account creation
    createSubAccount: async (req: Request, res: Response) => {
        try {
            await createSubAccount(req);
            res.status(201).send("Account Created");
        } catch (err) {
            logger(__dirname, "Error", { errorMessage: (err as Error).message });

            if ((err as Error).name === "duplicate_account") res.status(409).send("Error while registering.");
            else res.status(500).send("Error while registering.");
        }
    },
    // Get all sub account by restaurant id
    getAllAccountsByRestaurantId: async (req: Request, res: Response) => {
        try {
            const results = await getAllAccountsByRestaurantId(req);
            res.status(200).json({
                subAccounts: results,
            });
        } catch (err) {
            res.status(500).send("Request Error");
        }
    },
    // Sub account deletion
    deleteSubAccount: async (req: Request, res: Response) => {
        try {
            await deleteSubAccount(req);
        } catch (err) {
            res.status(404).send((err as Error).message);
        }
    },
    // Consult account
    getAccountInfo: async (req: Request, res: Response) => {
        try {
            await getAccountInfo(req);
        } catch (err) {
            res.status(404).send((err as Error).message);
        }
    },
    // Reset password
    resetPassword: async (req: Request, res: Response) => {
        try {
            await resetPassword(req);
        } catch (err) {
            res.status(404).send((err as Error).message);
        }
    },
    // Change password
    changePassword: async (req: Request, res: Response) => {
        try {
            await changePassword(req);
        } catch (err) {
            res.status(404).send((err as Error).message);
        }
    },
};

export default User;
