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
  /**
   * Handles user sign-up.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.body - The body of the request.
   * @param {string} req.body.name - The name of the user.
   * @param {string} req.body.email - The email of the user.
   * @param {string} req.body.password - The password of the user.
   * @param {string} req.body.type - The type of the user.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the user is created.
   */
  async signUp(req, res, next) {
    try {
      const { name, email, password, type } = req.body;
      let hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new UserModel(name, email, hashedPassword, type);
      const user = await this.userRepository.create(newUser);
      res.status(CREATED_CODE).json({
        succcess: true,
        message: "User created successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles user sign-in.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.body - The body of the request.
   * @param {string} req.body.email - The email of the user.
   * @param {string} req.body.password - The password of the user.
   * @param {Object} res - The response object.
   *
   * @returns {Promise<void>} - Returns a promise that resolves to void.
   *
   * @description
   * This method handles the sign-in process for a user. It retrieves the email and password from the request body,
   * checks if the user exists, compares the provided password with the stored hashed password, and generates a JWT token
   * if the credentials are correct. It sends appropriate responses based on the success or failure of the sign-in process.
   */
  async singIn(req, res, next) {
    try {
      // get email and password from request body
      const { email, password } = req.body;

      // get user by email
      const user = await this.userRepository.getByEmail(email);

      // if user not found, return error response
      if (!user) {
        return res
          .status(BAD_REQUEST_CODE)
          .json({ message: "Wrong Credentials", succcess: false });
      } else {
        // compare password with hashed password
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        // if password does not match, return error response
        if (!isPasswordMatch) {
          return res
            .status(BAD_REQUEST_CODE)
            .json({ message: "Wrong Credentials", succcess: false });
        } else {
          // generate JWT token
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

          // return success response with token
          return res
            .status(SUCCESS_CODE)
            .send({ message: "Login successfull", token, succcess: true });
        }
      }
    } catch (error) {
      next(error);
    }
  }
  async resetPassword(req, res, next) {
    try {
      const { password } = req.body;
      const userId = req.jwtUserID;
      let hashedPassword = await bcrypt.hash(password, 12);
      await this.userRepository.updatePassword(userId, hashedPassword);

      return res.status(SUCCESS_CODE).send({
        message: "Reset password successfully",
        succcess: true,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
