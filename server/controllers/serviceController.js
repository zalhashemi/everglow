const Service = require("../models/Service");
const Business = require("../models/Business");

const createService = async (req, res) => {
  try {
    const { name, durationMinutes, priceBHD, category, description } = req.body;

    if (!name || !durationMinutes || !priceBHD) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const service = await Service.create({
      business: req.business._id,
      name,
      durationMinutes,
      priceBHD,
      category,
      description
    });

    await Business.findByIdAndUpdate(req.business._id, {
      $push: { services: service._id }
    });

    res.status(201).json({ message: "Service created", service });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getMyServices = async (req, res) => {
  try {
    const services = await Service.find({ business: req.business._id });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateService = async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate(
      { _id: req.params.id, business: req.business._id },
      req.body,
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json({ message: "Service updated", service });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteService = async (req, res) => {
  try {
    const service = await Service.findOneAndDelete({
      _id: req.params.id,
      business: req.business._id
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    await Business.findByIdAndUpdate(req.business._id, {
      $pull: { services: service._id }
    });

    res.json({ message: "Service deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createService,
  getMyServices,
  updateService,
  deleteService
};
