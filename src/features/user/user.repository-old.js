import { USER_COLLECTION } from "../../config/collection.js";
import { getMongoDB } from "../../config/mongodb.js";
import ApplicationError from "../../error-handler/applicationError.js";
import {
  BAD_REQUEST_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} from "../../config/statusCode.js";

const getUsersCollection = async () => {
  const db = getMongoDB();
  return db.collection(USER_COLLECTION);
};
// here we are peforing the CRUD operations on the user collection by using the mongodb driver
class UserRepository {
  async create(user) {
    try {
      const userCollection = await getUsersCollection();
      await userCollection.insertOne(user);
      delete user.password; // removed password from response
      return user;
    } catch (error) {
      throw new ApplicationError(
        "problem with signup a user",
        INTERNAL_SERVER_ERROR_CODE,
        error.message
      );
    }
  }
  async login(email, password) {
    try {
      const userCollection = await getUsersCollection();
      return await userCollection.findOne({ email, password });
    } catch (error) {
      throw new ApplicationError(error.message, INTERNAL_SERVER_ERROR_CODE);
    }
  }
  async getByEmail(email) {
    try {
      const userCollection = await getUsersCollection();
      return await userCollection.findOne({ email });
    } catch (error) {
      throw new ApplicationError(error.message, INTERNAL_SERVER_ERROR_CODE);
    }
  }
}

export default UserRepository;
