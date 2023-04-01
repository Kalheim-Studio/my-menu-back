import type { Request, Response } from "express";

const createSubAccount = (req: Request, res: Response) => {
    res.status(201).send("Account Created - WIP");
};

export default createSubAccount;
