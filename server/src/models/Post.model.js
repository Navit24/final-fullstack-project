// src/models/Post.model.js

const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  content: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 5000,
    trim: true,
  },
  media: [
    {
      url: {
        type: String,
        trim: true,
      },
      alt: {
        type: String,
        maxlength: 256,
        trim: true,
        lowercase: true,
      },
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      text: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 5000,
        trim: true,
      },
      createAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

postSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});
module.exports = mongoose.model("Post", postSchema);
