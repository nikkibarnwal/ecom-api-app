import express from "express";
import UserController from "./user.controller.js";
import validateSignUpData from "../../middlewares/validateSignUpData.middleware.js";
import validateSignInData from "../../middlewares/validateSignInData.middleware.js";

const userRouter = express.Router();
const userController = new UserController();

userRouter.post("/signup", validateSignUpData, userController.signUp);

userRouter.post("/signin", validateSignInData, userController.singIn);

export default userRouter;
