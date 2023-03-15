import type { Request, Response } from "express";

const resetPassword = (req: Request, res: Response) => {
    // send mail
    res.status(200).send("Reset password Mail send - WIP");
};

export default resetPassword;
