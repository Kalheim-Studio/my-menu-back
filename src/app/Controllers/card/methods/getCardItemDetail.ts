import type { Request, Response } from "express";

const getCardItemDetail = (req: Request, res: Response) => {
    res.status(200).json({
        itemDetail: {},
    });
};

export default getCardItemDetail;
