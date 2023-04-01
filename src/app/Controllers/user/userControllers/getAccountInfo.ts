import type { Request, Response } from "express";

const getAccountInfo = (req: Request, res: Response) => {
    res.status(200).json({
        accountInfo: {},
    });
};

export default getAccountInfo;
