const express = require('express');
const router = express.Router();
const SpaService = require('../models/spaServiceModel');
const Therapist = require('../models/therapistModel');
const SpaBooking = require('../models/spaBookingModel');

// Get all spa services
router.get('/services', async (req, res) => {
  try {
    const services = await SpaService.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new spa service
router.post('/services', async (req, res) => {
  const service = new SpaService({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    duration: req.body.duration,
  });

  try {
    const newService = await service.save();
    res.status(201).json(newService);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all therapists
router.get('/therapists', async (req, res) => {
  try {
    const therapists = await Therapist.find();
    res.json(therapists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new therapist
router.post('/therapists', async (req, res) => {
  const therapist = new Therapist({
    name: req.body.name,
    specialty: req.body.specialty,
    availability: req.body.availability,
  });

  try {
    const newTherapist = await therapist.save();
    res.status(201).json(newTherapist);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all spa bookings
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await SpaBooking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new spa booking
router.post('/bookings', async (req, res) => {
  const booking = new SpaBooking({
    service: req.body.service,
    therapist: req.body.therapist,
    customer: req.body.customer,
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

module.exports = router;
