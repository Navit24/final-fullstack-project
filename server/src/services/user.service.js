// src/service/user.service.js

const userDAL = require("../dal/user.dal");
const jwt = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../utils/hashPassword");

const JWT_SECRET = process.env.JWT_SECRET;

// Get all user
async function getAllUsers() {
  return await userDAL.getAllUsers();
}

// Get user by Id
async function getUserById(id) {
  const user = await userDAL.getUserById(id);
  if (!user) throw new Error("User not found");
  return user;
}

// Register new user
async function registerUser(data) {
  const requiredFields = ["name", "email", "password", "phone"];
  for (const field of requiredFields) {
    if (!data[field]) throw new Error(`Missing required field: ${field}`);
  }

  const existingUser = await userDAL.getUserByEmail(data.email);
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await hashPassword(data.password);

  const newUserData = {
    ...data,
    password: hashedPassword,
  };

  const newUser = await userDAL.createUser(newUserData);

  return newUser;
}

// Login user
async function loginUser(data) {
  const { email, password } = data;
  const user = await userDAL.getUserByEmail(email);
  if (!user) throw new Error("User not found");

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { id: user._id.toString(), role: user.role },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  const sanitizedUser = user.toObject();
  delete sanitizedUser.password;

  return { user: sanitizedUser, token };
}

// Update user
async function updateUser(id, data, options = {}) {
  const payload = {
    ...data,
  };
  if( payload.password){
    payload.password=await hashPassword(payload.password);
  }
  if(!options.allowRoleUpdate){
    delete payload.role;
  }
  const user = await userDAL.updateUser(id, payload);
  if (!user) throw new Error("User not found");
  return user;
}

// Delete user
async function deleteUser(id) {
  const user = await userDAL.deleteUser(id);
  if (!user) throw new Error("User not found");
  return user;
}

module.exports = {
  getAllUsers,
  getUserById,
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
};
