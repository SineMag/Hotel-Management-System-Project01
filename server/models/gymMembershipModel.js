const mongoose = require('mongoose');

const gymMembershipSchema = new mongoose.Schema({
  member: {
    type: String,
    required: true,
  },
  membershipType: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
});

const GymMembership = mongoose.model('GymMembership', gymMembershipSchema);

module.exports = GymMembership;
