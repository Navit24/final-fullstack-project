// src/config/connect-atlas.js

const mongoose = require("mongoose");
const chalk = require("chalk");

// Connect to MongoDB Atlas
const connectAtlas = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_ATLAS);
    console.log(chalk.magentaBright("Connect To Atlas MongoDB!"));
  } catch (error) {
    console.log(chalk.redBright("Atlas connection failed:"), error.message);
  }
};

connectAtlas();
