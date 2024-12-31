import { body, validationResult } from "express-validator";

const productValidationRuqest = async (req, res, next) => {
  const rules = [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Product name is required")
      .isString()
      .withMessage("Product name must be a string"),
    body("desc")
      .trim()
      .optional()
      .isString()
      .withMessage("Product description must be a string"),
    body("price")
      .trim()
      .notEmpty()
      .withMessage("Product price is required")
      .isFloat({ gt: 0 })
      .withMessage("Product price must be a number greater than 0"),
    body("category")
      .trim()
      .notEmpty()
      .withMessage("Product category is required")
      .isString()
      .withMessage("Product category must be a string"),
    // body("stock")
    //   .notEmpty()
    //   .withMessage("Product stock is required")
    //   .isInt({ gt: -1 })
    //   .withMessage("Product stock must be a non-negative integer"),
  ];
  await Promise.all(rules.map((rule) => rule.run(req)));

  const validationError = validationResult(req);
  if (!validationError.isEmpty()) {
    const errMsg = [];
    validationError.errors.map((err) => errMsg.push({ [err.path]: err.msg }));
    return res.status(process.env.BAD_REQUEST_CODE).json({ message: errMsg });
  }
  next();
};

export default productValidationRuqest;
