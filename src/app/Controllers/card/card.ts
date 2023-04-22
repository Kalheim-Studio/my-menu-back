import { Request, Response } from "express";
import getCard from "./services/getCard";
import createMenu from "./services/createMenu";
import createCardItem from "./services/createCardItem";
import getCardItemDetail from "./services/getCardItemDetail";

const card = {
    // Get Card
    getCard: async (req: Request, res: Response) => {
        try {
            await getCard(req);
        } catch (err) {
            res.status(404).send((err as Error).message);
        }
    },
    // Create Menu
    createMenu: async (req: Request, res: Response) => {
        try {
            await createMenu(req);
        } catch (err) {
            res.status(404).send((err as Error).message);
        }
    },
    // Create Card Item
    createCardItem: async (req: Request, res: Response) => {
        try {
            await createCardItem(req);
        } catch (err) {
            res.status(404).send((err as Error).message);
        }
    },
    // get Card Item detail
    getCardItemDetail: async (req: Request, res: Response) => {
        try {
            await getCardItemDetail(req);
        } catch (err) {
            res.status(404).send((err as Error).message);
        }
    },
};

export default card;
