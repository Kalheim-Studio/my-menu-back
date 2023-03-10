import express, { Application, Request, Response } from "express";
import logger from "morgan";
import cors  from "cors";

const app:Application = express();

app.use(cors());

app.use(express.json());

app.use(logger("dev"));
app.use("/", (req: Request, res: Response) =>
  res.status(200).json({
    answer: "response!!!!!",
    body: req.body ? req.body : "none",
  })
);

export default app;
