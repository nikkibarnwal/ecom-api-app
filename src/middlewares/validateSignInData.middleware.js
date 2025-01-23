import { body, validationResult } from "express-validator";
import {
  BAD_REQUEST_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} from "../config/statusCode.js";

const validateSignInData = async (req, res, next) => {
  const rules = [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Enter valid email"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6, max: 12 })
      .withMessage("Password must be between 6 and 12 characters")
      .matches(/^[a-zA-Z0-9#$@]+$/)
      .withMessage(
        "Password must contain only alphanumeric characters and #$@"
      ),
  ];

  try {
    // run all rules
    await Promise.all(rules.map((rule) => rule.run(req)));
    // get if we have any errors
    const validationErrors = validationResult(req);

    // check if we have any errors
    if (!validationErrors.isEmpty()) {
      const errMsg = [];
      validationErrors.errors.map((err) =>
        errMsg.push({ [err.path]: err.msg })
      );
      return res.status(BAD_REQUEST_CODE).json({ message: errMsg });
    }
  } catch (error) {
    return res
      .status(INTERNAL_SERVER_ERROR_CODE)
      .json({ message: "Internal Server Error" });
  }
  next();
};

export default validateSignInData;
