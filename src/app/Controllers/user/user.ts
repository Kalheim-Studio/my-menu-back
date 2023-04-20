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
            res.status(400).send("Error while registering");
        }
    },
    // Account Validation
    validateAccount,
    // User authentication
    authenticate,
    // Sub account creation
    createSubAccount,
    // Get all sub account by restaurant id
    getAllAccountsByRestaurantId,
    // Sub account deletion
    deleteSubAccount,
    // Consult account
    getAccountInfo,
    // Reset password
    resetPassword,
    // Change password
    changePassword,
};

export default User;
