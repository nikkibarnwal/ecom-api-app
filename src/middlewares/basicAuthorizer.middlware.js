import UserModel from "../features/user/user.model.js";

const basicAuthorizer = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).send("Authorization header missing");
  }
  console.log("authHeader", authHeader);
  const [type, credentials] = authHeader.split(" ");
  console.log("type- credentials :-", type, credentials);
  if (type !== "Basic" || !credentials) {
    return res.status(401).send("Invalid authorization format");
  }

  const decodedCredentials = Buffer.from(credentials, "base64").toString(
    "ascii"
  );
  console.log("type- decodedCredentials :-", decodedCredentials);
  const [email, password] = decodedCredentials.split(":");
  const user = UserModel.getAllUsers().find((user) => {
    if (user.email === email && user.password === password) {
      return user;
    }
  });
  if (!user) {
    return res.status(401).send("Invalid credentials");
  }

  req.user = user;
  next();
};

export default basicAuthorizer;
