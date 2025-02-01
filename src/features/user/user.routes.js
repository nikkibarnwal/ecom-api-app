import express from "express";
import UserController from "./user.controller.js";
import validateSignUpData from "../../middlewares/validateSignUpData.middleware.js";
import validateSignInData from "../../middlewares/validateSignInData.middleware.js";
import validateResetPassword from "../../middlewares/validateResetPassword.middleware.js";
import jwtAuth from "../../middlewares/jwtAuth.middleware.js";

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
userRouter.post(
  "/reset-password",
  jwtAuth,
  validateResetPassword,
  (req, res, next) => userController.resetPassword(req, res, next)
);

export default userRouter;
