import express from "express";
import card from "../Controllers/card/card";
import checkData from "../Middlewares/checkData/checkData";
import checkAuth from "../Middlewares/checkAuth/checkAuth";

const cardRouter = express.Router();

cardRouter.get("/get-card", card.getCard);
cardRouter.post("/create-menu", checkAuth, checkData, card.createMenu);
cardRouter.post("/create-card-item", checkAuth, checkData, card.createCardItem);
cardRouter.get("/card-item-detail", card.getCardItemDetail);

export default cardRouter;
