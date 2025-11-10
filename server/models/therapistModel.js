const mongoose = require('mongoose');

const therapistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  specialty: {
    type: String,
    required: true,
  },
  availability: {
    type: [String],
    required: true,
  },
});

const Therapist = mongoose.model('Therapist', therapistSchema);

module.exports = Therapist;
