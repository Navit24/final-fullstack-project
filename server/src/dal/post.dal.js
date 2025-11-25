// src/dal/post.dal.js

const Post = require("../models/Post.model");

// Get all posts
async function getAllPosts(filter = {}, options = {}) {
  const query = Post.find(filter)
    .populate("author", "-password")
    .populate("comments.user", "-password")
    .sort({ createAt: -1 });
  if (options.limit) query.limit(options.limit);
  if (options.skip) query.skip(options.skip);
  return query;
}

// Get post by id
async function getPostById(id) {
  return await Post.findById(id)
    .populate("author", "-password")
    .populate("comments.user", "-password");
}

// Create a new post
async function createPost(data) {
  const newPost = await Post.create(data);
  return await Post.findById(newPost._id)
    .populate("author", "-password")
    .populate("comments.user", "-password");
}

// Edit post
async function updatePost(id, data) {
  return await Post.findByIdAndUpdate(id, data, { new: true })
    .populate("author", "-password")
    .populate("comments.user", "-password");
}

// Delete post
async function deletePost(id) {
  return await Post.findByIdAndDelete(id);
}

// Like/unlike post
async function toggleLike(postId, userId) {
  const post = await Post.findById(postId);
  if (!post) return null;
  const exists = post.likes.some((u) => u.toString() === userId);
  if (exists) {
    post.likes = post.likes.filter((u) => u.toString() !== userId);
  } else {
    post.likes.push(userId);
  }
  await post.save();
  return await Post.findById(postId)
    .populate("author", "-password")
    .populate("comments.user", "-password");
}

// Add comment
async function addComment(postId, userId, text) {
  const post = await Post.findById(postId);
  if (!post) return null;
  post.comments.push({ user: userId, text });
  await post.save();
  return await Post.findById(postId)
    .populate("author", "-password")
    .populate("comments.user", "-password");
}

// Get comments by post id
async function getCommentsByPostId(postId) {
  const post = await Post.findById(postId)
    .populate("comments.user", "-password")
    .select("comments");
  if (!post) return null;
  return post.comments;
}

// Toggle save/unsave post
async function toggleSave(postId, userId) {
  const User = require("../models/User.model");
  const user = await User.findById(userId);
  if (!user) return null;

  const post = await Post.findById(postId);
  if (!post) return null;

  const exists = user.savedPosts.some((p) => p.toString() === postId);
  if (exists) {
    user.savedPosts = user.savedPosts.filter((p) => p.toString() !== postId);
  } else {
    user.savedPosts.push(postId);
  }
  await user.save();
  return await Post.findById(postId)
    .populate("author", "-password")
    .populate("comments.user", "-password");
}

// Delete comment
async function deleteComment(postId, commentId, userId) {
  const post = await Post.findById(postId);
  if (!post) return null;

  const comment = post.comments.id(commentId);
  if (!comment) throw new Error("Comment not found");

  const isOwner = comment.user.toString() === userId;
  const isPostOwner = post.author.toString() === userId;
  if (!isOwner && !isPostOwner) throw new Error("Access denied");

  post.comments.pull(commentId);
  await post.save();
  return await Post.findById(postId)
    .populate("author", "-password")
    .populate("comments.user", "-password");
}

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  getCommentsByPostId,
  toggleSave,
  deleteComment,
};
