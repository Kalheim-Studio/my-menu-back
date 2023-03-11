import express from "express";
import logger from "morgan";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());

app.use(logger("dev"));
app.use("/", (req, res) =>
    res.status(200).json({ answer: "response", body: req.body ? req.body : "none" })
);

export default app;
