import express from "express";
import { waiterController } from "../../Controllers";
import { checkAuth } from "../../Middlewares";

const waiterRouter = express.Router();

waiterRouter.use("/get-table-list", checkAuth, waiterController.getTableList);
waiterRouter.use("/get-table-detail/", checkAuth, waiterController.getTableDetail);

export { waiterRouter };
