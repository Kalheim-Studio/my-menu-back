import type { Request, Response } from "express";

const validateAccount = (req: Request, res: Response) => {
    // TODO: Check Token
    res.status(200).send("Account validated: WIP");
};

export default validateAccount;
