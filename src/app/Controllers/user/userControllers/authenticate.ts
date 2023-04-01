import type { Request, Response } from "express";

const authentication = (req: Request, res: Response) => {
    res.status(200).json({
        token: "4fda65az4e65f4a69e5f495a4 - WIP",
    });
};

export default authentication;
