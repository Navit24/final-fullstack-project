// src/controllers/user.controller.js

const express = require("express");
const router = express.Router();
const userService = require("../services/user.service");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");
const {
  registerSchema,
  updateSchema,
} = require("../validations/user.validation");

// Get all users
router.get("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user by Id
router.get("/:id", auth, async (req, res) => {
  try {
    const isAdmin = req.user.role === "admin";
    const isOwner = req.user.id === req.params.id;
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "Access denied" });
    }
    const user = await userService.getUserById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Register
router.post("/register", validate(registerSchema), async (req, res) => {
  try {
    const newUser = await userService.registerUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { user, token } = await userService.loginUser(req.body);
    res.json({ user, token });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

// Update user
router.put("/:id", auth, validate(updateSchema), async (req, res) => {
  try {
    const isAdmin = req.user.role === "admin";
    const isOwner = req.user.id === req.params.id;
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "Access denied" });
    }
    const updatedUser = await userService.updateUser(req.params.id, req.body, {
      allowRoleUpdate: isAdmin,
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete user
router.delete("/:id", auth, async (req, res) => {
  try {
    const isAdmin = req.user.role === "admin";
    const isOwner = req.user.id === req.params.id;
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "Access denied" });
    }
    const deletedUser = await userService.deleteUser(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
