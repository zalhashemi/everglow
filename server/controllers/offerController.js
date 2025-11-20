const Offer = require("../models/Offer");

// BUSINESS CREATES OFFER
const createOffer = async (req, res) => {
  try {
    const {
      title,
      servicesAppliedOn = [],
      discountPercent,
      validFrom,
      validTo,
    } = req.body;

    if (!title || !discountPercent || !validFrom || !validTo) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const offer = await Offer.create({
      business: req.business._id,
      title,
      servicesAppliedOn,
      discountPercent,
      validFrom,
      validTo,
    });

    res.status(201).json({ message: "Offer created", offer });
  } catch (err) {
    console.error("Error in createOffer:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// BUSINESS GETS THEIR OFFERS
const getMyOffers = async (req, res) => {
  try {
    const { status } = req.query;
    const now = new Date();

    const filter = { business: req.business._id };

    if (status === "active") {
      filter.validTo = { $gte: now };
    } else if (status === "past") {
      filter.validTo = { $lt: now };
    }

    const offers = await Offer.find(filter)
      .populate("servicesAppliedOn")
      .sort({ createdAt: -1 });

    res.json(offers);
  } catch (err) {
    console.error("Error in getMyOffers:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUBLIC: GET ACTIVE OFFERS FOR A BUSINESS
const getPublicOffersForBusiness = async (req, res) => {
  try {
    const offers = await Offer.find({
      business: req.params.businessId,
      validTo: { $gte: new Date() },
    }).populate("servicesAppliedOn");

    res.json(offers);
  } catch (err) {
    console.error("Error in getPublicOffersForBusiness:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE OFFER (business)
const updateOffer = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Offer.findOneAndUpdate(
      { _id: id, business: req.business._id },
      req.body,
      { new: true }
    ).populate("servicesAppliedOn");

    if (!updated) {
      return res.status(404).json({ message: "Offer not found" });
    }

    res.json({ message: "Offer updated", offer: updated });
  } catch (err) {
    console.error("Error in updateOffer:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE OFFER
const deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Offer.findOneAndDelete({
      _id: id,
      business: req.business._id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Offer not found" });
    }

    res.json({ message: "Offer deleted" });
  } catch (err) {
    console.error("Error in deleteOffer:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createOffer,
  getMyOffers,
  getPublicOffersForBusiness,
  updateOffer,
  deleteOffer,
};
