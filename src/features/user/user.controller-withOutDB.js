import jwt from "jsonwebtoken";

import { uid } from "../../utils/common.js";
import UserModel from "./user.model.js";
import {
  BAD_REQUEST_CODE,
  CREATED_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  SUCCESS_CODE,
} from "../../config/statusCode.js";

class UserController {
  async signUp(req, res) {
    try {
      const { name, email, password, type } = req.body;
      const userDetails = {
        name,
        email,
        password,
        type,
      };
      const user = await UserModel.SignUp(userDetails);
      res.status(CREATED_CODE).json(user);
    } catch (error) {
      res.status(BAD_REQUEST_CODE).json({ error: error.message });
    }
  }
  singIn(req, res) {
    try {
      const { email, password } = req.body;
      const user = UserModel.SignIn(email, password);
      if (!user) {
        return res
          .status(BAD_REQUEST_CODE)
          .json({ error: "Wrong Credentials" });
      }
      const token = jwt.sign(
        { userid: user.id, email: user.email },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      return res
        .status(SUCCESS_CODE)
        .send({ message: "Login successfull", token });
    } catch (error) {
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .json({ error: error.message });
    }
  }
}

export default UserController;
