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

// PUT /posts/:id - Update post (only author)
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to edit this post' });
    }

    const { title, content, category, image, excerpt, tags } = req.body;
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (category !== undefined) post.category = category;
    if (image !== undefined) post.image = image;
    if (excerpt !== undefined) post.excerpt = excerpt;
    if (tags !== undefined) {
      post.tags = Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim());
    }

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /posts/:id - Delete post (only author)
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to delete this post' });
    }

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
