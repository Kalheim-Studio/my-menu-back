import express from "express";
import waiter from "../Controllers/waiter/waiter";
import checkAuth from "../Middlewares/checkAuth/checkAuth";

const waiterRouter = express.Router();

waiterRouter.use("/get-table-list", checkAuth, waiter.getTableList);
waiterRouter.use("/get-table-detail/", checkAuth, waiter.getTableDetail);

export default waiterRouter;
