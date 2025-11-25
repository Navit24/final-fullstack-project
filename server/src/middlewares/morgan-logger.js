// src/middlewares/morgan-logger.js

const chalk = require("chalk");
const morgan = require("morgan");

// Define the morgan logger middleware
const morganLogger = morgan((tokens, req, res) => {
  const status = Number(tokens.status(req, res));
  const israelTime = new Date().toLocaleString("sv-SE", {
    timeZone: "Asia/Jerusalem",
    hour12: false,
  });
  const logMessage = [
    israelTime,
    tokens.method(req, res),
    tokens.url(req, res),
    status,
    "-",
    tokens["response-time"](req, res),
    "ms",
  ].join(" ");
  return (status >= 400 ? chalk.redBright : chalk.cyanBright)(logMessage);
});

module.exports = morganLogger;
