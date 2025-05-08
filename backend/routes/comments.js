// routes/comments.js
const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// GET /comments/:postId - Get all comments for a specific post
router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).populate('author', 'username');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /comments - Add a new comment
router.post('/', async (req, res) => {
  const { content, author, postId } = req.body;
  try {
    const newComment = new Comment({ content, author, postId });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /comments/:id - Delete a comment
router.delete('/:id', async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
