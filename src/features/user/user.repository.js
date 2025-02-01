import mongoose from "mongoose";
import { USER_COLLECTION } from "../../config/collection.js";
import { UserScema } from "./user.schema.js";
import ApplicationError from "../../error-handler/applicationError.js";
import {
  INTERNAL_SERVER_ERROR_CODE,
  NOT_FOUND_CODE,
} from "../../config/statusCode.js";
import { InObjectId } from "../../utils/common.js";

// define the user model with the schema
const UserModel = mongoose.model(USER_COLLECTION, UserScema);

// here we are peforing the CRUD operations on the user collection by using the mongoose
class UserRepository {
  /**
   * Creates a new user.
   *
   * @param {Object} user - The user object.
   * @returns {Promise<Object>} - A promise that resolves when the operation is complete.
   */
  async create(user) {
    try {
      const newUser = new UserModel(user);
      await newUser.save();
      //  removed password from response
      newUser.password = undefined;
      return newUser;
    } catch (error) {
      throw new ApplicationError(error.message, INTERNAL_SERVER_ERROR_CODE);
    }
  }
  async login(email, password) {
    try {
      return await UserModel.findOne({ email, password });
    } catch (error) {
      throw new ApplicationError(error.message, INTERNAL_SERVER_ERROR_CODE);
    }
  }
  async getByEmail(email) {
    try {
      return await UserModel.findOne({ email });
    } catch (error) {
      throw new ApplicationError(error.message, INTERNAL_SERVER_ERROR_CODE);
    }
  }
  async updatePassword(userId, password) {
    try {
      const user = await UserModel.findById(InObjectId(userId));
      if (!user) {
        throw new ApplicationError("User not found", NOT_FOUND_CODE);
      } else {
        user.password = password;
        user.save();
      }
    } catch (error) {
      throw new ApplicationError(error.message, INTERNAL_SERVER_ERROR_CODE);
    }
  }
}

export default UserRepository;
