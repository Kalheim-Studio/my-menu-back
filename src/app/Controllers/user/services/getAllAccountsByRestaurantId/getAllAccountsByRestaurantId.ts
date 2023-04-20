import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { logger } from "../../../../../Utils/logger/logger";
import TokenData from "../../../../Types/TokenData";
import { User } from "../../../../Models/User";

const getAllAccountsByRestaurantId = async (req: Request, res: Response) => {
    logger(__dirname, "Get all account by restaurant Id");
    // Getting restaurantId from token
    const { restaurantId } = jwt.decode(String(req.headers.token)) as TokenData;

    // Getting sub account which are not "Owner" by restaurant id
    const response = await User.find({
        $and: [{ restaurantId: restaurantId }, { role: { $ne: "Owner" } }],
    });
    res.status(200).json({
        subAccounts: response,
    });
};

export default getAllAccountsByRestaurantId;
