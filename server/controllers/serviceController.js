const Service = require("../models/Service");
const Business = require("../models/Business");

// CREATE SERVICE
const createService = async (req, res) => {
  try {
    const { name, durationMinutes, priceBHD, description } = req.body;

    if (!name || !durationMinutes || !priceBHD)
      return res.status(400).json({ message: "Missing fields" });

    const service = await Service.create({
      business: req.business._id,
      name,
      durationMinutes,
      priceBHD,
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

// GET ALL SERVICES FOR BUSINESS
const getMyServices = async (req, res) => {
  const services = await Service.find({ business: req.business._id });
  res.json(services);
};

// UPDATE
const updateService = async (req, res) => {
  const service = await Service.findOneAndUpdate(
    { _id: req.params.id, business: req.business._id },
    req.body,
    { new: true }
  );

  if (!service) return res.status(404).json({ message: "Service not found" });

  res.json({ message: "Updated", service });
};

// DELETE
const deleteService = async (req, res) => {
  const service = await Service.findOneAndDelete({
    _id: req.params.id,
    business: req.business._id
  });

  if (!service) return res.status(404).json({ message: "Not found" });

  res.json({ message: "Deleted" });
};

module.exports = {
  createService,
  getMyServices,
  updateService,
  deleteService
};
