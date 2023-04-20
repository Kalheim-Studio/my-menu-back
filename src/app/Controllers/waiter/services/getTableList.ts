import type { Request, Response } from "express";

const getTableList = (req: Request, res: Response) => {
    res.status(200).json({
        tables: [],
    });
};

export default getTableList;
