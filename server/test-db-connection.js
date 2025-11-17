require("dotenv").config({ path: './server/.env' });
const mongoose = require("mongoose");

// Enable debug logging
mongoose.set('debug', true);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    console.error(error); // full error object with code, host, etc.
    process.exit(1);
  });
