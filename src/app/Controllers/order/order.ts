import type { Request, Response } from "express";
import orderItem from "./services/orderItem";
import getOrderInfo from "./services/getOrderInfo";

const order = {
    // Order an item
    orderItem: async (req: Request, res: Response) => {
        try {
            await orderItem(req);
        } catch (err) {
            res.status(404).send((err as Error).message);
        }
    },
    // get order info
    getOrderInfo: async (req: Request, res: Response) => {
        try {
            await getOrderInfo(req);
        } catch (err) {
            res.status(404).send((err as Error).message);
        }
    },
};

export default order;
