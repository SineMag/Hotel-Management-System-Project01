const express = require('express');
const router = express.Router();
const GymMembership = require('../models/gymMembershipModel');
const Trainer = require('../models/trainerModel');
const GymBooking = require('../models/gymBookingModel');
const AccessLog = require('../models/accessLogModel');

// Get all gym memberships
router.get('/memberships', async (req, res) => {
  try {
    const memberships = await GymMembership.find();
    res.json(memberships);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new gym membership
router.post('/memberships', async (req, res) => {
  const membership = new GymMembership({
    member: req.body.member,
    membershipType: req.body.membershipType,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
  });

  try {
    const newMembership = await membership.save();
    res.status(201).json(newMembership);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a gym membership
router.delete('/memberships/:id', getMembership, async (req, res) => {
  try {
    await res.membership.deleteOne();
    res.json({ message: 'Deleted Gym Membership' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a gym membership
router.put('/memberships/:id', getMembership, async (req, res) => {
  if (req.body.member != null) {
    res.membership.member = req.body.member;
  }
  if (req.body.membershipType != null) {
    res.membership.membershipType = req.body.membershipType;
  }
  if (req.body.startDate != null) {
    res.membership.startDate = req.body.startDate;
  }
  if (req.body.endDate != null) {
    res.membership.endDate = req.body.endDate;
  }
  try {
    const updatedMembership = await res.membership.save();
    res.json(updatedMembership);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Middleware to get membership object by ID
async function getMembership(req, res, next) {
  let membership;
  try {
    membership = await GymMembership.findById(req.params.id);
    if (membership == null) {
      return res.status(404).json({ message: 'Cannot find membership' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.membership = membership;
  next();
}

// Get all trainers
router.get('/trainers', async (req, res) => {
  try {
    const trainers = await Trainer.find();
    res.json(trainers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new trainer
router.post('/trainers', async (req, res) => {
  const trainer = new Trainer({
    name: req.body.name,
    specialty: req.body.specialty,
    availability: req.body.availability,
  });

  try {
    const newTrainer = await trainer.save();
    res.status(201).json(newTrainer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a trainer
router.delete('/trainers/:id', getTrainer, async (req, res) => {
  try {
    await res.trainer.deleteOne();
    res.json({ message: 'Deleted Trainer' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a trainer
router.put('/trainers/:id', getTrainer, async (req, res) => {
  if (req.body.name != null) {
    res.trainer.name = req.body.name;
  }
  if (req.body.specialty != null) {
    res.trainer.specialty = req.body.specialty;
  }
  if (req.body.availability != null) {
    res.trainer.availability = req.body.availability;
  }
  try {
    const updatedTrainer = await res.trainer.save();
    res.json(updatedTrainer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Middleware to get trainer object by ID
async function getTrainer(req, res, next) {
  let trainer;
  try {
    trainer = await Trainer.findById(req.params.id);
    if (trainer == null) {
      return res.status(404).json({ message: 'Cannot find trainer' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.trainer = trainer;
  next();
}

// Get all gym bookings
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await GymBooking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new gym booking
router.post('/bookings', async (req, res) => {
  const booking = new GymBooking({
    sessionName: req.body.sessionName,
    trainer: req.body.trainer,
    member: req.body.member,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
  });

  try {
    const newBooking = await booking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- Access Control Logging ---

// Get all access logs
router.get('/access-logs', async (req, res) => {
  try {
    const logs = await AccessLog.find().populate('member', 'member').sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new access log
router.post('/access-logs', async (req, res) => {
  const log = new AccessLog({
    member: req.body.member,
  });

  try {
    const newLog = await log.save();
    res.status(201).json(newLog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
