import ApplicationError from "../error-handler/applicationError.js";

export const errorHandlerMiddleware = (err, req, res, next) => {
  // Write your code here
  if (err instanceof ApplicationError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  return res
    .status(500)
    .json({ message: "Oops! Something went wrong... Please try again later!" });
};
