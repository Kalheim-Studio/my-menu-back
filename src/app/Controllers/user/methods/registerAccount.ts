import type { Request, Response } from "express";

const registerAccount = (req: Request, res: Response) => {
    //Send mail
    res.status(201).send("Register account : WIP");
};

export default registerAccount;
