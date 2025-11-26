// server.js

const express = require("express");
const cors = require("./src/middlewares/cors");
const chalk = require("chalk");
require("dotenv").config();
const connectDB = require("./src/config/db-service");

const app = express();
const PORT = process.env.PORT || 5000;

const mainRouter = require("./src/routes/router");
const morganLogger = require("./src/middlewares/morgan-logger");

// Middleware
app.use(cors);
app.use(morganLogger);
// app.use(express.json());
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));
app.use("/api", mainRouter);

// Connect to DB and start server
connectDB();
app.listen(PORT, () => {
  console.log(chalk.cyanBright(`Server running on port ${PORT}`));
});
