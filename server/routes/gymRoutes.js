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
