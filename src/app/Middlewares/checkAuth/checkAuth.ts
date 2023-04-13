import type { Request, Response, NextFunction } from "express";

const checkAuth = (req: Request, res: Response, next: NextFunction) => {
    console.log("check auth", req.headers.token);
    next();
};

export default checkAuth;
