import { NOT_FOUND_CODE } from "../config/statusCode.js";

const invalidRoutesHandlerMiddleware = (req, res, next) => {
  res.status(NOT_FOUND_CODE).json({
    success: false,
    msg: `Invalid path: ${req.originalUrl} for more information at http://localhost:3100/api-docs`,
  });
  next();
};

export default invalidRoutesHandlerMiddleware;
