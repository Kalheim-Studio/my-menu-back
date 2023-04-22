import express from "express";
import user from "../Controllers/user/user";
import checkData from "../Middlewares/checkData/checkData";
import checkAuth from "../Middlewares/checkAuth/checkAuth";

const userRouter = express.Router();

userRouter.post("/register", checkData, user.registerAccount);
userRouter.put("/validate-account/:token", user.validateAccount);
userRouter.post("/authenticate", checkData, user.authenticate);
userRouter.post("/create-sub-account", checkAuth, checkData, user.createSubAccount);
userRouter.get("/accounts-by-rest-id", checkAuth, user.getAllAccountsByRestaurantId);
userRouter.delete("/delete-sub-account", checkAuth, user.deleteSubAccount);
userRouter.get("/get-account-info", checkAuth, user.getAccountInfo);
userRouter.get("/reset-password", user.resetPassword);
userRouter.put("/change-password/:token", checkData, user.changePassword);

export default userRouter;
