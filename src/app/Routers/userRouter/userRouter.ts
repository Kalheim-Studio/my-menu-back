import express from "express";
import { userController } from "../../Controllers";
import { checkAuth, checkData } from "../../Middlewares";

const userRouter = express.Router();

userRouter.post("/register", checkData, userController.registerAccount);
userRouter.put("/validate-account/:token", userController.validateAccount);
userRouter.post("/authenticate", checkData, userController.authenticate);
userRouter.get("/check-authenticated", checkAuth, userController.checkAuthenticated);
userRouter.post("/create-sub-account", checkAuth, checkData, userController.createSubAccount);
userRouter.get("/accounts-by-rest-id", checkAuth, userController.getAllAccountsByRestaurantId);
userRouter.delete("/delete-sub-account", checkAuth, userController.deleteSubAccount);
userRouter.get("/get-account-info", checkAuth, userController.getAccountInfo);
userRouter.get("/reset-password", userController.resetPassword);
userRouter.put("/change-password/:token", checkData, userController.changePassword);

export { userRouter };
