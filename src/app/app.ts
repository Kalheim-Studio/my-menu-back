import express from "express";
import logger from "morgan";
import cors from "cors";

import { userRouter, menuRouter, waiterRouter, orderRouter } from "./Routers";

// Create application
const app = express();

// cors
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
// Menu
app.use("/card", menuRouter);
// Waiter
app.use("/waiter", waiterRouter);
// Order
app.use("/order", orderRouter);
// Any other route
app.use("/", (req, res) => res.status(404).json({ answer: "Ressource not found." }));

export default app;
