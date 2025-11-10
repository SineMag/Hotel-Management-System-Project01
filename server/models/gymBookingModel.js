const mongoose = require('mongoose');

const gymBookingSchema = new mongoose.Schema({
  sessionName: {
    type: String,
    required: true,
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer',
    required: true,
  },
  member: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
});

const GymBooking = mongoose.model('GymBooking', gymBookingSchema);

module.exports = GymBooking;
