// src/routes/router.js

const express = require("express");
const router = express.Router();
const userRoutes = require("../controllers/user.controller");
const postRoutes = require("../controllers/post.controller");
const { errorHandler } = require("../utils/error-handler");

// Mount the card and user controllers
router.use("/users", userRoutes);
router.use("/posts", postRoutes);

// Handle 404 errors for undefined routes
router.use((req, res) => {
  errorHandler(res, 404, "Page Not Found");
});

module.exports = router;
