const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
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

const Trainer = mongoose.model('Trainer', trainerSchema);

module.exports = Trainer;
