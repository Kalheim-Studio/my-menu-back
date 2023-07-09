import express from "express";
import logger from "morgan";
import cors from "cors";

import { router } from "./Routers";

// Create application
const app = express();

// cors
app.use(cors());
    
// Json Acceptation
app.use(express.json());

// Logger
app.use(logger("dev"));

// router
app.use(router);

export default app;
