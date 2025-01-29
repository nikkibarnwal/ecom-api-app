import express from "express";
import UserController from "./user.controller.js";
import validateSignUpData from "../../middlewares/validateSignUpData.middleware.js";
import validateSignInData from "../../middlewares/validateSignInData.middleware.js";

const userRouter = express.Router();
const userController = new UserController();

userRouter.post("/signup", validateSignUpData, (req, res, next) =>
  /* because we are using the class UserController 
  and have to create an instance of it for userReposiotry*/
  userController.signUp(req, res, next)
);

userRouter.post("/signin", validateSignInData, (req, res, next) =>
  userController.singIn(req, res, next)
);

export default userRouter;
