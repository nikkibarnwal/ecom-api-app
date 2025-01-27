import ApplicationError from "../error-handler/applicationError.js";
import { logger } from "./logger.middleware.js";

export const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof ApplicationError) {
    logger.error(err.logMessage);
    return res.status(err.statusCode).json({
      message: err.message, // Send the custom error message to the user
      success: false,
    });
  }
  logger.error(err.message);
  return res.status(500).json({
    message: "Oops! Something went wrong... Please try again later!",
    success: false,
  });
};
