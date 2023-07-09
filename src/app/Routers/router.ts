import express from "express";
import { userRouter } from "./userRouter/userRouter";
import { menuRouter } from "./menuRouter/menuRouter";
import { waiterRouter } from "./waiterRouter/waiterRouter";
import { orderRouter} from "./orderRouter/orderRouter";

const router = express.Router();

/**
 * Routes
 */
// User
router.use("/user", userRouter);
// Menu
router.use("/menu", menuRouter);
// Waiter
router.use("/waiter", waiterRouter);
// Order
router.use("/order", orderRouter);
// Any other route
router.use("/", (req, res) => res.status(404).json({ answer: "Ressource not found." }));

export { router };
