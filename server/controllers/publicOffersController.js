const Offer = require("../models/Offer");
const Business = require("../models/Business");

exports.getAllActiveOffers = async (req, res) => {
  try {
    const offers = await Offer.find({
      validTo: { $gte: new Date() }
    })
      .populate({
        path: "business",
        select: "businessName imageUrl city address" 
      })
      .populate("servicesAppliedOn");

    res.json(offers);
  } catch (err) {
    console.error("Error fetching offers:", err);
    res.status(500).json({ message: "Server error" });
  }
};
