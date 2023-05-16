import type { Request, Response } from "express";
import { getOrderInfo, orderItem } from "./services";

const orderController = {
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

export { orderController };
