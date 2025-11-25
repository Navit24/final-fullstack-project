// src/models/User.js

const mongoose = require("mongoose");

// Define the User schema
const userSchema = new mongoose.Schema({
  name: {
    first: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 256,
      trim: true,
      lowercase: true,
    },
    last: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 256,
      trim: true,
      lowercase: true,
    },
  },
  phone: {
    type: String,
    required: true,
    match: RegExp(/^0\d{1,2}-?\s?\d{3}\s?\d{4}$/),
  },
  birthDate: {
    type: Date,
    default: null,
  },
  email: {
    type: String,
    required: true,
    match: RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  avatar: {
    url: {
      type: String,
      validate: {
        validator(value) {
          if (!value) return true;
          return value.startsWith("data:image/") || /^https?:\/\//.test(value);
        },
        message: "Avatar URL must be a valid URL or data URI",
      },
      trim: true,
      default:
        "https://cdn.pixabay.com/photo/2016/04/01/10/11/avatar-1299805_960_720.png",
    },
    alt: {
      type: String,
      // minlength: 2,
      maxlength: 256,
      trim: true,
      lowercase: true,
      default: "profile",
    },
  },
  address: {
    country: {
      type: String,
      minlength: 2,
      maxlength: 256,
      trim: true,
      lowercase: true,
    },
    city: {
      type: String,
      minlength: 2,
      maxlength: 256,
      trim: true,
      lowercase: true,
    },
    street: {
      type: String,
      minlength: 2,
      maxlength: 256,
      trim: true,
      lowercase: true,
    },
    houseNumber: {
      type: Number,
      minlength: 1,
      trim: true,
    },
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
