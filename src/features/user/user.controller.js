import jwt from "jsonwebtoken";

import { uid } from "../../utils/common.js";
import UserModel from "./user.model.js";

class UserController {
  async signUp(req, res) {
    try {
      const { name, email, password, type } = req.body;
      const userDetails = {
        id: uid(),
        name,
        email,
        password,
        type,
      };
      const user = await UserModel.SignUp(userDetails);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  singIn(req, res) {
    try {
      const { email, password } = req.body;
      const user = UserModel.SignIn(email, password);
      if (!user) {
        return res.status(400).json({ error: "Wrong Credentials" });
      }
      const token = jwt.sign(
        { userid: user.id, email: user.email },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      return res.status(200).send({ message: "Login successfull", token });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default UserController;
