import type { Request, Response } from "express";

const createMenu = (req: Request, res: Response) => {
    res.status(201).send("Menu has been created - WIP");
};

export default createMenu;
