require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in your .env file.');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully!');
    mongoose.connection.close(); // Close connection after successful test
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err.message);
    console.error('Please check your MONGODB_URI in server/.env and your MongoDB Atlas IP Access List.');
    process.exit(1);
  });
