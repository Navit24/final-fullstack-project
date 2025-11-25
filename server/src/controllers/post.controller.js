// src/controllers/post.controller.js

const express = require("express");
const router = express.Router();
const postService = require("../services/post.service");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");
const {
  createPostSchema,
  updatePostSchema,
  addCommentSchema,
} = require("../validations/post.validation");

// Get all post
router.get("/", async (req, res) => {
  try {
    const { author, limit, skip } = req.query;
    const posts = await postService.listPosts({
      author,
      limit: limit ? Number(limit) : undefined,
      skip: skip ? Number(skip) : undefined,
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get my posts
router.get("/my", auth, async (req, res) => {
  try {
    const { limit, skip } = req.query;
    const posts = await postService.getMyPosts(req.user.id, {
      limit: limit ? Number(limit) : undefined,
      skip: skip ? Number(skip) : undefined,
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get saved posts
router.get("/saved", auth, async (req, res) => {
  try {
    const { limit, skip } = req.query;
    const posts = await postService.getSavedPosts(req.user.id, {
      limit: limit ? Number(limit) : undefined,
      skip: skip ? Number(skip) : undefined,
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get post by id
router.get("/:id", async (req, res) => {
  try {
    const post = await postService.getPost(req.params.id);
    res.json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Create new post
router.post("/", auth, validate(createPostSchema), async (req, res) => {
  try {
    const post = await postService.createPost(req.user.id, req.body);
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Toggle save/unsave post
router.post("/:id/save", auth, async (req, res) => {
  try {
    const updated = await postService.toggleSave(req.params.id, req.user);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update post
router.put("/:id", auth, validate(updatePostSchema), async (req, res) => {
  try {
    const updated = await postService.updatePost(
      req.params.id,
      req.user,
      req.body
    );
    res.json(updated);
  } catch (error) {
    const code = error.message === "Access denied" ? 403 : 400;
    res.status(code).json({ message: error.message });
  }
});

// Delete post
router.delete("/:id", auth, async (req, res) => {
  try {
    await postService.deletePost(req.params.id, req.user);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    const code = error.message === "Access denied" ? 403 : 400;
    res.status(code).json({ message: error.message });
  }
});

// Toggle like
router.post("/:id/like", auth, async (req, res) => {
  try {
    const updated = await postService.toggleLike(req.params.id, req.user);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add comment
router.post(
  "/:id/comments",
  auth,
  validate(addCommentSchema),
  async (req, res) => {
    try {
      const updated = await postService.addComment(
        req.params.id,
        req.user,
        req.body.text
      );
      res.json(updated);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);


// Delete comment
router.delete("/:id/comments/:commentId", auth, async (req, res) => {
  try {
    const updated = await postService.deleteComment(
      req.params.id,
      req.params.commentId,
      req.user
    );
    res.json(updated);
  } catch (error) {
    const code = error.message === "Access denied" ? 403 : 400;
    res.status(code).json({ message: error.message });
  }
});

// Get comments by post id
router.get("/:id/comments", async (req, res) => {
  try {
    const comments = await postService.getCommentsByPostId(req.params.id);
    res.json(comments);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;
