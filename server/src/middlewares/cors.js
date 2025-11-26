// src/middlewares/cors.js

const express = require("express");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:5000",
    ],
    optionsSuccessStatus: 200,
  })
);

module.exports = app;