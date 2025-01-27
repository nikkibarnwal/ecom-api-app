class ApplicationError extends Error {
  constructor(message, statusCode, logMessage) {
    super(message);
    this.statusCode = statusCode;
    this.logMessage = logMessage || message;
    Error.captureStackTrace(this, this.constructor);
  }
  toJSON() {
    return {
      message: this.message,
      statusCode: this.statusCode,
      logMessage: this.logMessage,
    };
  }
}

export default ApplicationError;
