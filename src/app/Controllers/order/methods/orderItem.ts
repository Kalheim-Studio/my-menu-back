import type { Request, Response } from "express";

const orderItem = (req: Request, res: Response) => {
    res.status(200).send("Item ordered - WIP");
};

export default orderItem;
