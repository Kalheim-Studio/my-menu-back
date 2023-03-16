import type { Request, Response } from "express";

const deleteSubAccount = (req: Request, res: Response) => {
    res.status(200).send("Account deleted - WIP");
};

export default deleteSubAccount;
