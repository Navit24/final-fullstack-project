// src/config/db.js

require("dotenv").config();
const chalk = require("chalk");

const ENV = process.env.NODE_ENV || "development";

const connectDB = () => {
  if (ENV === "development") {
    require("./connect-local");
  } else if (ENV === "production") {
    require("./connect-atlas");
  } else {
    console.log(chalk.red(`Unknown environment: ${ENV}`));
  }
};

module.exports = connectDB;
