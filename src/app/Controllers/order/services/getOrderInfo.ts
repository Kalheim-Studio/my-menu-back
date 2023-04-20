import type { Request, Response } from "express";

const getOrderInfo = (req: Request, res: Response) => {
    res.status(200).json({
        orderInfo: "OrderInfo - WIP",
    });
};

export default getOrderInfo;
