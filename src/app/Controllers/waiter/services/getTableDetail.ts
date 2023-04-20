import type { Request, Response } from "express";

const getTableDetail = (req: Request, res: Response) => {
    res.status(200).json({
        tableDetail: [],
    });
};

export default getTableDetail;
