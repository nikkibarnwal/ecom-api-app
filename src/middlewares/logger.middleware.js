// here in this file i am not getting req.body data help me on this
import fs from "fs";
import winston from "winston";

const fsPromises = fs.promises;
/*
Logging by custom code without using any library
const log = async (logData) => {
  logData = `${new Date().toString()} - ${logData}\n`;

  try {
    await fsPromises.appendFile("log.txt", logData);
  } catch (error) {
    console.error("Error while writing to file", error);
  }
};
*/
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "request-logging" },
  transports: [
    //
    // - Write all logs with importance level of `error` or higher to `error.log`
    //   (i.e., error, fatal, but not other levels)
    //
    new winston.transports.File({ filename: "error.log", level: "error" }),
    //
    // - Write all logs with importance level of `info` or higher to `combined.log`
    //   (i.e., fatal, error, warn, and info, but not trace)
    //
    new winston.transports.File({ filename: "combined.log" }),
  ],
});
const loggerMiddleware = async (req, res, next) => {
  //   if (req.url.includes("api-docs") || req.url.includes("signin")) {
  //     return next();
  //   }
  const logData = `${new Date().toString()} req URL: ${req.url}  reqBody:${
    req.body ? JSON.stringify(req.body) : ""
  }`;

  //   const logData = `${req.method} ${req.url} ${
  //     req.headers["user-agent"]
  //   } ${JSON.stringify(req.body)}`;
  //   await log(logData);
  logger.info(logData);
  next();
};

export default loggerMiddleware;
