import type { Request, Response } from "express";

const changePassword = (req: Request, res: Response) => {
    // verif token
    res.status(200).send("Password has been changed - WIP");
};

export default changePassword;
