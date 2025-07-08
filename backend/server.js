// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const rateLimit = require('express-rate-limit');

const app = express();

// Enable trust proxy for services like Render
app.set('trust proxy', true);

const allowedOrigins = ['https://miniblog-okfa.onrender.com'];

// Basic, open CORS (optional: you can restrict it later if needed)
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // safe to leave on even if you're not using cookies
}));

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // max 30 requests per IP per minute
  message: 'Too many requests. Please try again later.',
});
app.use(limiter);

// Body parsers
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Routes
const postRoutes = require('./routes/posts');
app.use('/posts', postRoutes);

const commentRoutes = require('./routes/comments');
app.use('/comments', commentRoutes);

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// MongoDB Connection and Server Start
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => console.error(err));
