import express from "express";
import logger from "morgan";
import cors from "cors";

import userRouter from "./Routers/userRouter";
import cardRouter from "./Routers/cardRouter";
import waiterRouter from "./Routers/waiterRouter";
import orderRouter from "./Routers/orderRouter";

// Créate application
const app = express();
// Utilisation cors
app.use(cors());
// Json Acceptation
app.use(express.json());
// Logger
app.use(logger("dev"));

/**
 * Routes
 */
// User
app.use("/user", userRouter);
// Card
app.use("/card", cardRouter);
// Waiter
app.use("/waiter", waiterRouter);
// Order
app.use("/order", orderRouter);
// Any other route
app.use("/", (req, res) => res.status(400).json({ answer: "Ressource not found." }));

export default app;
