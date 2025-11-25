// src/user.dal.js

const User = require("../models/User.model");

// Get all users
async function getAllUsers() {
  return await User.find().select("-password");
}

// Get user by Id
async function getUserById(id) {
  return await User.findById(id).select("-password");
}

// Get user by email
async function getUserByEmail(email) {
  return await User.findOne({ email });
}

// Function to create a new user
async function createUser(data) {
  const newUser = await User.create(data);
  return User.findById(newUser._id).select("-password");
}

// Update user
async function updateUser(id, data) {
  return await User.findByIdAndUpdate(id, data, { new: true }).select(
    "-password"
  );
}

// Delete user
async function deleteUser(id) {
  return await User.findByIdAndDelete(id);
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
};
