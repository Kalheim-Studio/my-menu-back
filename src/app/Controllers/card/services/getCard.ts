import type { Request, Response } from "express";

const getCard = (req: Request, res: Response) => {
    res.status(200).json({
        card: ["Card - WIP"],
    });
};

export default getCard;
