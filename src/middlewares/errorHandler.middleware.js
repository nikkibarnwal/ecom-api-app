import mongoose from "mongoose";
import {
  BAD_REQUEST_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} from "../config/statusCode.js";
import ApplicationError from "../error-handler/applicationError.js";
import { logger } from "./logger.middleware.js";

export const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  if (err instanceof ApplicationError) {
    logger.error(err.logMessage);
    return res.status(err.statusCode).json({
      message: err.message, // Send the custom error message to the user
      success: false,
    });
  } else if (err instanceof mongoose.Error.ValidationError) {
    logger.error(err.logMessage);
    return res.status(BAD_REQUEST_CODE).json({
      message: err.message, // Send the custom error message to the user
      success: false,
    });
  }
  logger.error(err.message);
  return res.status(INTERNAL_SERVER_ERROR_CODE).json({
    message: "Oops! Something went wrong... Please try again later!",
    success: false,
  });
};
