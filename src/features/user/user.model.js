import { getMongoDB } from "../../config/mongodb.js";
import { USER_COLLECTION } from "../../config/collection.js";
import ApplicationError from "../../error-handler/applicationError.js";

export default class UserModel {
  constructor(name, email, password, type, id) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.type = type;
    this._id = id;
  }

  static SignIn(email, password) {
    const user = DBUsers.find(
      (u) =>
        u.email.trim().toLowerCase() === email.trim().toLowerCase() &&
        u.password.trim() === password.trim()
    );
    return user;
  }
  static getAllUsers() {
    return DBUsers;
  }
  static userById(id) {
    return DBUsers.find((user) => Number(user.id) == Number(id));
  }
}
const DBUsers = [
  {
    id: 1,
    name: "Seller User",
    email: "seller@ecom.com",
    password: "Password1",
    type: "seller",
  },
  {
    id: 2,
    name: "Customer User",
    email: "customer@ecom.com",
    password: "Password1",
    type: "customer",
  },
];
