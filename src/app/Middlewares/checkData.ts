import type { Request, Response, NextFunction } from "express";

// Checking Data
const checkData = (req: Request, res: Response, next: NextFunction) => {
    console.log("Check Data");
    next();
};

export default checkData;
