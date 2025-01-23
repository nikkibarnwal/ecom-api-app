import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import UserModel from "./user.model.js";
import UserRepository from "./user.repository.js";
import {
  BAD_REQUEST_CODE,
  CREATED_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  SUCCESS_CODE,
} from "../../config/statusCode.js";

class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }
  async signUp(req, res) {
    const { name, email, password, type } = req.body;
    let hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new UserModel(name, email, hashedPassword, type);
    const user = await this.userRepository.create(newUser);
    res.status(CREATED_CODE).json({
      succcess: true,
      message: "User created successfully",
      data: user,
    });
  }
  async singIn(req, res) {
    const { email, password } = req.body;
    const user = await this.userRepository.getByEmail(email);
    if (!user) {
      return res
        .status(BAD_REQUEST_CODE)
        .json({ message: "Wrong Credentials", succcess: false });
    } else {
      /* compare password with hased password */
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res
          .status(BAD_REQUEST_CODE)
          .json({ message: "Wrong Credentials", succcess: false });
      } else {
        const token = jwt.sign(
          {
            userid: user._id,
            name: user.name,
            email: user.email,
            type: user.type,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );
        return res
          .status(SUCCESS_CODE)
          .send({ message: "Login successfull", token, succcess: true });
      }
    }
  }
}

export default UserController;
