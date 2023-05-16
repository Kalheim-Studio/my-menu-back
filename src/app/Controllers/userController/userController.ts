import type { Request, Response } from "express";
// Services
import {
    registerAccount,
    validateAccount,
    authenticate,
    createSubAccount,
    getAllAccountsByRestaurantId,
    deleteSubAccount,
    getAccountInfo,
    resetPassword,
    changePassword,
} from "./services";
// Utils
import { logger } from "../../../Utils";

const userController = {
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
    // Check if valid authentication token
    checkAuthenticated: async (req: Request, res: Response) => {
        res.status(200).json({
            authenticated: true,
        });
    },
    // Sub account creation
    createSubAccount: async (req: Request, res: Response) => {
        try {
            await createSubAccount(req);
            res.status(201).send("Account Created");
        } catch (err) {
            logger(__dirname, "Error", { errorMessage: (err as Error).message });

            if ((err as Error).name === "duplicate-account") res.status(409).send("Error while registering.");
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
            res.status(500).send("Request error");
        }
    },
    // Sub account deleting
    deleteSubAccount: async (req: Request, res: Response) => {
        try {
            await deleteSubAccount(req);
            res.status(200).send("Account deleted");
        } catch (err) {
            if ((err as Error).name === "no-account") res.status(404).send((err as Error).message);
            else res.status(500).send("Error while deleting account");
        }
    },
    // Consult account
    getAccountInfo: async (req: Request, res: Response) => {
        try {
            const result = await getAccountInfo(req);
            res.status(200).json(result);
        } catch (err) {
            res.status(404).send((err as Error).message);
        }
    },
    // Reset password
    resetPassword: async (req: Request, res: Response) => {
        try {
            await resetPassword(req);
            res.status(200).send("Reset password mail has been sent");
        } catch (err) {
            res.status(404).send((err as Error).message);
        }
    },
    // Change password
    changePassword: async (req: Request, res: Response) => {
        try {
            await changePassword(req);
            res.status(200).send("Password changed");
        } catch (err) {
            res.status(404).send((err as Error).message);
        }
    },
};

export { userController };
