import type { Request, Response } from "express";

const getAllSubAccount = (req: Request, res: Response) => {
    res.status(200).json({
        subAccounts: ["All subAccounts"],
    });
};

export default getAllSubAccount;
