// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Enable trust proxy for services like Render
app.set('trust proxy', true);

// Secure and flexible CORS configuration
const allowedOrigins = [
  'https://miniblog-okfa.onrender.com', // your frontend
  // add other trusted origins here if needed
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., monitoring tools like UptimeRobot)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

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

// CORS error handler (optional but useful for debugging)
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'CORS error: Origin not allowed' });
  }
  next(err);
});

// MongoDB Connection and Server Start
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => console.error(err));
