import type { Request } from "express";
import jwt from "jsonwebtoken";
import { User } from "../../../../Models/User";
import { Restaurant } from "../../../../Models/Restaurant";
import { logger } from "../../../../../Utils/logger/logger";
import AuthToken from "../../../../Types/AuthToken";

const getAccountInfo = async (req: Request) => {
    logger(__dirname, "Get account info");
    // Getting restaurantId from token
    const authToken = String(req.headers.authorization).replace("Bearer ", "");
    const { restaurantId } = jwt.decode(authToken) as AuthToken;

    // Getting restaurant and owner account with restaurant id
    const restaurant = await Restaurant.findOne({ _id: restaurantId });
    const owner = await User.findOne({ restaurantId: restaurantId, role: "Owner" });

    if (!(owner && restaurant)) throw new Error("No account has been found");

    return {
        owner: {
            identifier: owner.identifier,
            firstname: owner.firstname,
            lastname: owner.lastname,
        },
        restaurant: {
            name: restaurant.name,
            address: restaurant.address,
            postalCode: restaurant.postalCode,
            city: restaurant.city,
            phone: restaurant.phone,
            email: restaurant.email,
            table: restaurant.table,
        },
    };
};

export default getAccountInfo;