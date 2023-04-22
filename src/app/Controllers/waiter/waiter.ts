import type { Request, Response } from "express";
import getTableList from "./services/getTableList";
import getTableDetail from "./services/getTableDetail";
const waiter = {
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

export default waiter;
