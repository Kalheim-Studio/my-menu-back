import type { Request } from "express";
import jwt from "jsonwebtoken";
import { User } from "../../../../Models/User";
import AuthToken from "../../../../Types/AuthToken";
import { logger } from "../../../../../Utils/logger/logger";

const deleteSubAccount = async (req: Request) => {
    logger(__dirname, "Deleting sub account");
    // Get restaurant if from token
    const authToken = String(req.headers.authorization).replace("Bearer ", "");
    const { restaurantId } = jwt.decode(authToken) as AuthToken;

    // Searching account to delete
    const accountToDelete = await User.findOne({ restaurantId: restaurantId, identifier: req.body.identifier });

    if (!accountToDelete) {
        logger(__dirname, "Error", { errorMessage: "No account to delete" });
        const error = new Error("No accoun to delete");
        error.name = "no-account";
        throw error;
    }

    logger(__dirname, "Attempt to delete account");

    // Checking if owner role
    if (accountToDelete.role === "Owner") {
        logger(__dirname, "Error", { errorMessage: "Can't delete owner account" });
        const error = new Error("No accoun to delete");
        error.name = "owner-account";
        throw error;
    }

    // Deleting account
    await User.deleteOne({ restaurantId: restaurantId, identifier: req.body.identifier });

    logger(__dirname, "Account deleted", { successMessage: "OK" });
};

export default deleteSubAccount;
