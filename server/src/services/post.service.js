// src/services/post.service.js

const postDAL = require("../dal/post.dal");

// Get all posts
async function listPosts({ author, limit, skip }) {
  const filter = {};
  if (author) filter.author = author;
  return await postDAL.getAllPosts(filter, { limit, skip });
}

// Get post by id
async function getPost(id) {
  const post = await postDAL.getPostById(id);
  if (!post) throw new Error("Post not found");
  return post;
}

// Create a new post
async function createPost(authorId, data) {
  const payload = { ...data, author: authorId };
  const post = await postDAL.createPost(payload);
  return post;
}

// Edit post
async function updatePost(id, userContext, data) {
  const post = await postDAL.getPostById(id);
  if (!post) throw new Error("Post not found");
  const isOwner = post.author._id.toString() === userContext.id;
  const isAdmin = userContext.role === "admin";
  if (!isOwner && !isAdmin) throw new Error("Access denied");
  const updated = await postDAL.updatePost(id, data);
  return updated;
}

// Delete post
async function deletePost(id, userContext) {
  const post = await postDAL.getPostById(id);
  if (!post) throw new Error("Post not found");
  const isOwner = post.author._id.toString() === userContext.id;
  const isAdmin = userContext.role === "admin";
  if (!isOwner && !isAdmin) throw new Error("Access denied");
  await postDAL.deletePost(id);
  return true;
}

// Like/unlike post
async function toggleLike(postId, userContext) {
  const updated = await postDAL.toggleLike(postId, userContext.id);
  if (!updated) throw new Error("Post not found");
  return updated;
}

// Add comment
async function addComment(postId, userContext, text) {
  const updated = await postDAL.addComment(postId, userContext.id, text);
  if (!updated) throw new Error("Post not found");
  return updated;
}

// Get my posts
async function getMyPosts(userId, { limit, skip }) {
  return await postDAL.getAllPosts({ author: userId }, { limit, skip });
}

// Get saved posts
async function getSavedPosts(userId, { limit, skip }) {
  const User = require("../models/User.model");
  const user = await User.findById(userId).select("savedPosts");
  if (!user) throw new Error("User not found");

  const savedPostIds = user.savedPosts || [];
  return await postDAL.getAllPosts(
    { _id: { $in: savedPostIds } },
    { limit, skip }
  );
}

// Get comments by post id
async function getCommentsByPostId(postId) {
  const comments = await postDAL.getCommentsByPostId(postId);
  if (!comments) throw new Error("Post not found");
  return comments;
}

// Toggle save/unsave post
async function toggleSave(postId, userContext) {
  const updated = await postDAL.toggleSave(postId, userContext.id);
  if (!updated) throw new Error("Post not found");
  return updated;
}

// Delete comment
async function deleteComment(postId, commentId, userContext) {
  const updated = await postDAL.deleteComment(
    postId,
    commentId,
    userContext.id
  );
  if (!updated) throw new Error("Post not found");
  return updated;
}

module.exports = {
  listPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  getMyPosts,
  getSavedPosts,
  getCommentsByPostId,
  toggleSave,
  deleteComment,
};
