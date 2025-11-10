const mongoose = require('mongoose');

const spaBookingSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SpaService',
    required: true,
  },
  therapist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Therapist',
    required: true,
  },
  customer: {
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

const SpaBooking = mongoose.model('SpaBooking', spaBookingSchema);

module.exports = SpaBooking;
