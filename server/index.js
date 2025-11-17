
require('dotenv').config({ path: './server/.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const spaRoutes = require('./routes/spaRoutes');
const gymRoutes = require('./routes/gymRoutes');

app.get('/', (req, res) => {
  res.send('Hotel Management System API is running...');
});

app.use('/api/spa', spaRoutes);
app.use('/api/gym', gymRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Connection error', err);
  });
