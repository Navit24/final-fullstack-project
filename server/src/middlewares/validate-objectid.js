// src/middlewares/validate-objectid.js

const mongoose = require("mongoose");
const { validateObjectId } = require("../utils/validate-objectid");

// Middleware to validate ObjectId in route parameters
const validateObjectIdParam = (paramName = "id") => {
  return (req, res, next) => {
    try {
      validateObjectId(req.params[paramName]);
      next();
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };
};

// Middleware to validate ObjectId in query parameters
const validateObjectIdQuery = (paramName = "id") => {
  return (req, res, next) => {
    if (req.query[paramName]) {
      try {
        validateObjectId(req.query[paramName]);
        next();
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }
    } else {
      next();
    }
  };
};

module.exports = { validateObjectIdParam, validateObjectIdQuery };
