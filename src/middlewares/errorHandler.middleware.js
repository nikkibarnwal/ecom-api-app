import ApplicationError from "../error-handler/applicationError.js";
import { logger } from "./logger.middleware.js";

export const errorHandlerMiddleware = (err, req, res, next) => {
  // Write your code here
  if (err instanceof ApplicationError) {
    logger.error(err.message);
    return res
      .status(err.statusCode)
      .json({ message: err.message, success: false });
  }
  // console.error(err);
  return res.status(500).json({
    message: "Oops! Something went wrong... Please try again later!",
    success: false,
  });
};
