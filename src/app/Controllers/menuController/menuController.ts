import { Request, Response } from "express";

import { createMenuItem, createMenu, getMenu, getMenuItemDetail } from "./services";

const menuController = {
    // Get Card
    getMenu: async (req: Request, res: Response) => {
        try {
            await getMenu(req);
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
    createMenuItem: async (req: Request, res: Response) => {
        try {
            await createMenuItem(req);
        } catch (err) {
            res.status(404).send((err as Error).message);
        }
    },
    // get Card Item detail
    getMenuItemDetail: async (req: Request, res: Response) => {
        try {
            await getMenuItemDetail(req);
        } catch (err) {
            res.status(404).send((err as Error).message);
        }
    },
};

export { menuController };
