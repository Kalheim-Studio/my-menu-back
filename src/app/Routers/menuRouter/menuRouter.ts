import express from "express";
import { menuController } from "../../Controllers";
import { checkAuth, checkData } from "../../Middlewares";

const menuRouter = express.Router();

menuRouter.get("/get-Menu", menuController.getMenu);
menuRouter.post("/create-menu", checkAuth, checkData, menuController.createMenu);
menuRouter.post("/create-menu-item", checkAuth, checkData, menuController.createMenuItem);
menuRouter.get("/menu-item-detail", menuController.getMenuItemDetail);

export { menuRouter };
