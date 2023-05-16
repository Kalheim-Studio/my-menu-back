import type { Request, Response } from "express";
import { getTableDetail, getTableList } from "./services";

const waiterController = {
    // Get table list
    getTableList: async (req: Request, res: Response) => {
        try {
            await getTableList(req);
        } catch (err) {
            res.status(404).send((err as Error).message);
        }
    },
    // Table detail
    getTableDetail: async (req: Request, res: Response) => {
        try {
            await getTableDetail(req);
        } catch (err) {
            res.status(404).send((err as Error).message);
        }
    },
};

export { waiterController };
