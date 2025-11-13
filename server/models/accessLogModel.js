const mongoose = require('mongoose');

const accessLogSchema = new mongoose.Schema({
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GymMembership',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const AccessLog = mongoose.model('AccessLog', accessLogSchema);

module.exports = AccessLog;
