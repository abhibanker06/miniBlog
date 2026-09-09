// routes/comments.js
const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const auth = require('../middleware/authMiddleware');

// GET /comments/:postId - Get all comments for a specific post
router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).populate('author', 'username');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /comments - Add a new comment (auth required)
router.post('/', auth, async (req, res) => {
  const { content, postId } = req.body; 
  try {
    if (!content || !postId) {
      return res.status(400).json({ error: 'Content and postId are required' });
    }
    const newComment = new Comment({
      content,
      author: req.user.id,
      postId
    });
    await newComment.save();
    const populated = await Comment.findById(newComment._id).populate('author', 'username');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /comments/:id - Delete a comment (only author)
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    if (comment.author && comment.author.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
