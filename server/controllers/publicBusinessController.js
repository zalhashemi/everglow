const Business = require("../models/Business");
const Service = require("../models/Service");

// GET ALL BUSINESSES (for homepage)
const getAllBusinesses = async (req, res) => {
  const businesses = await Business.find().select(
    "businessName ownerName description address"
  );
  res.json(businesses);
};

// GET BUSINESS DETAILS + SERVICES
const getBusinessDetails = async (req, res) => {
  const business = await Business.findById(req.params.id).select(
    "businessName ownerName description address"
  );

  if (!business)
    return res.status(404).json({ message: "Business not found" });

  const services = await Service.find({ business: business._id });

  res.json({ business, services });
};

module.exports = {
  getAllBusinesses,
  getBusinessDetails
};
