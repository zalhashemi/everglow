const Business = require("../models/Business");
const Service = require("../models/Service");
const Offer = require("../models/Offer");

// GET ALL BUSINESSES (for homepage)
const getAllBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find({})
      .select("businessName businessType city description");

    res.json(businesses);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET BUSINESS DETAILS + SERVICES + ACTIVE OFFERS
const getBusinessDetails = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id).select(
      "businessName businessType address city description operatingHours socialLinks staff"
    );

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    const services = await Service.find({ business: business._id });
    const offers = await Offer.find({
      business: business._id,
      validTo: { $gte: new Date() }
    });

    res.json({ business, services, offers });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllBusinesses,
  getBusinessDetails
};
