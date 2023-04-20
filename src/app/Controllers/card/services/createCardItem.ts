import type { Request, Response } from "express";

const createCardItem = (req: Request, res: Response) => {
    res.status(201).send("Card Item has been created - WIP");
};

export default createCardItem;
