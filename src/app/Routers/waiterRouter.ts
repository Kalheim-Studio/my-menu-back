import express from "express";
import waiter from "../Controllers/waiter/waiter";

const waiterRouter = express.Router();

waiterRouter.use("/get-table-list", waiter.getTableList);
waiterRouter.use("/get-table-detail/", waiter.getTableDetail);

export default waiterRouter;
