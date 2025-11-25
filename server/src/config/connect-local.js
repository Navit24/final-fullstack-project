//src/config/connect-local.js

const mongoose = require("mongoose");
const chalk = require("chalk");

// Connect to local MongoDB instances
const connectLocal = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_LOCAL);
    console.log(chalk.magentaBright("Connect Locally To MongoDB!"));
  } catch (error) {
    console.log(
      chalk.redBright("Local MongoDB connection failed:"),
      error.message
    );
  }
};

connectLocal();
