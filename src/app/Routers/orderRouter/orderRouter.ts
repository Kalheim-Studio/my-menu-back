import express from "express";
import { orderController } from "../../Controllers";

const orderRouter = express.Router();

orderRouter.post("/order-item", orderController.orderItem);
orderRouter.get("/order-info", orderController.getOrderInfo);

export { orderRouter };
