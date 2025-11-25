// src/utils/error-handler.js

const chalk = require("chalk");
const { logError } = require("./error-logger");

// Generic error handler
const errorHandler = (res, status, message = "Server error") => {
  console.error(chalk.red(message));
  logError(status, message);
  return res.status(status).json({ success: false, message });
};

module.exports = { errorHandler };
