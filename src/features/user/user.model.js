export default class UserModel {
  constructor(id, name, email, password, type) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.type = type;
  }
  static SignUp(user) {
    DBUsers.push({ ...user });
    return user;
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
