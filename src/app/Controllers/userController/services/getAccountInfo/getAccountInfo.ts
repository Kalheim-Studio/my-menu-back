import type { Request } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { Restaurant } from "../../../../Models/Restaurant";
import { logger } from "../../../../../Utils";
import { AuthToken } from "../../../../Types/";

type Owner = {
    role: string;
    identifier: string;
    firstname: string;
    lastname: string;
}

const getAccountInfo = async (req: Request) => {
    logger(__dirname, "Get account info");
    // Getting restaurantId from token
    const authToken = String(req.headers.authorization).replace("Bearer ", "");
    const { restaurantId } = jwt.decode(authToken) as AuthToken;
    
    // Get Restaurant and owner
    const query = await Restaurant.aggregate([
        {
            $match: {
                _id: new Types.ObjectId(restaurantId)
            }
        },
        {
            $lookup: {
                from: "User",
                localField: "_id",
                foreignField: "restaurantId",
                as: "results"
            }
        },
    ]).match({"results.role": "Owner"});

    const owner = (query[0].results as Owner[]).filter((user) => user.role === "Owner")[0];

    return {
        owner: {
            identifier: owner.identifier,
            firstname: owner.firstname,
            lastname: owner.lastname,
        },
        restaurant: {
            name: query[0].name,
            siret: query[0].siret,
            address: query[0].address,
            postalCode: query[0].postalCode,
            city: query[0].city,
            phone: query[0].phone,
            email: query[0].email,
            table: query[0].table
        },
    };
};

export { getAccountInfo };
