const SpaService = require('../models/spaServiceModel');

// Create a new SPA service
exports.createSpaService = async (req, res) => {
  try {
    const spaService = new SpaService(req.body);
    await spaService.save();
    res.status(201).send(spaService);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get all SPA services
exports.getSpaServices = async (req, res) => {
  try {
    const spaServices = await SpaService.find({});
    res.status(200).send(spaServices);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get a single SPA service by ID
exports.getSpaServiceById = async (req, res) => {
  try {
    const spaService = await SpaService.findById(req.params.id);
    if (!spaService) {
      return res.status(404).send();
    }
    res.status(200).send(spaService);
  } catch (error) {
    res.status(500).send(error);
  }
};
