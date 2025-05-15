// routes/posts.js
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../middleware/authMiddleware.js');

// GET /posts - List all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /posts - Create a new post (only for logged-in users)
router.post('/', auth, async (req, res) => {

  const { title, content, category, image, excerpt, tags } = req.body;
  
  try {
    const newPost = new Post({
      title,
      content,
      category,
      image,
      excerpt,
      tags: tags?.split(',').map(tag => tag.trim()), // handle comma-separated input
      author: req.user.id // This should work as we are passing decoded user info from the token
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /posts/:id - View a single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username');
    res.json(post);
  } catch (err) {
    res.status(404).json({ error: 'Post not found' });
  }
});

// PUT /posts/:id - Update post
router.put('/:id', async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /posts/:id - Delete post
router.delete('/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /posts/user/:userId - Get posts by a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId }).populate('author', 'username');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /posts/related/:postId
router.get('/related/:postId', async (req, res) => {
  try {
    const currentPost = await Post.findById(req.params.postId);
    if (!currentPost) return res.status(404).json({ error: "Post not found" });

    const relatedPosts = await Post.find({
      category: currentPost.category,
      _id: { $ne: currentPost._id }, // exclude current post
    }).limit(3); 

    res.json(relatedPosts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
