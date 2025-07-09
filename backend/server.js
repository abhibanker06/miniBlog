const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Enable trust proxy for Render
app.set('trust proxy', true);

// CORS configuration
app.use(cors({
  origin: 'https://miniblog-okfa.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.options('*', cors()); // Handle pre-flight requests

// Body parsers
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Routes
app.use('/posts', require('./routes/posts'));
app.use('/comments', require('./routes/comments'));
app.use('/auth', require('./routes/auth'));

// Test route for debugging
app.get('/test-cors', (req, res) => {
  res.json({ message: 'CORS test' });
});

// MongoDB Connection and Server Start
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('Connected to MongoDB');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error('MongoDB connection error:', err));
