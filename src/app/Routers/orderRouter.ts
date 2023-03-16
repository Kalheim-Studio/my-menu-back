import express from "express";
import order from "../Controllers/order/order";

const orderRouter = express.Router();

orderRouter.post("/order-item", order.orderItem);
orderRouter.get("/order-info", order.getOrderInfo);

export default orderRouter;
