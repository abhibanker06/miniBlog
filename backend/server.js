// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.set('trust proxy', true);
app.use(cors());

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

app.get('/ping', (req, res) => {
  res.status(200).send('pong');
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
