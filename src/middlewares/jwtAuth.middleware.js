import jwt from "jsonwebtoken";

const jwtAuth = (req, res, next) => {
  let token = req.header("Authorization");

  if (!token) {
    return res
      .status(process.env.UNAUTHORIZED_CODE)
      .send({ error: "Access denied. No token provided." });
  }

  try {
    token = token.replace("bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // this way we can access value in anywhere, where want to pass req
    req.jwtUserID = decoded.userid;
    next();
  } catch (ex) {
    res.status(process.env.BAD_REQUEST_CODE).send({ error: "Invalid token." });
  }
};

export default jwtAuth;
