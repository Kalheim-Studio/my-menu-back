import type { Request } from "express";
import jwt from "jsonwebtoken";
import { User } from "../../../../Models/User";
import { logger } from "../../../../../Utils/logger/logger";
import TokenData from "../../../../Types/TokenData";

const getAllAccountsByRestaurantId = async (req: Request) => {
    logger(__dirname, "Get all account by restaurant Id");
    // Getting restaurantId from token
    const authToken = String(req.headers.authorization).replace("Bearer ", "");
    const { restaurantId } = jwt.decode(authToken) as TokenData;

    // Getting sub account which are not "Owner" by restaurant id
    const results = await User.find({
        $and: [{ restaurantId: restaurantId }, { role: { $ne: "Owner" } }],
    });
    return results;
};

export default getAllAccountsByRestaurantId;
