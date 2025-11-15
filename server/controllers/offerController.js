const Offer = require("../models/Offer");

// BUSINESS CREATES OFFER
const createOffer = async (req, res) => {
  try {
    const { title, servicesAppliedOn, discountPercent, validFrom, validTo } = req.body;

    if (!title || !discountPercent || !validFrom || !validTo) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const offer = await Offer.create({
      business: req.business._id,
      title,
      servicesAppliedOn,
      discountPercent,
      validFrom,
      validTo
    });

    res.status(201).json({ message: "Offer created", offer });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// BUSINESS GETS THEIR OFFERS
const getMyOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ business: req.business._id })
      .populate("servicesAppliedOn");
    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// PUBLIC: GET OFFERS FOR A BUSINESS
const getPublicOffersForBusiness = async (req, res) => {
  try {
    const offers = await Offer.find({
      business: req.params.businessId,
      validTo: { $gte: new Date() }
    }).populate("servicesAppliedOn");

    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE OFFER (business)
const updateOffer = async (req, res) => {
  try {
    const offer = await Offer.findOneAndUpdate(
      { _id: req.params.id, business: req.business._id },
      req.body,
      { new: true }
    );

    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    res.json({ message: "Offer updated", offer });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE OFFER
const deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findOneAndDelete({
      _id: req.params.id,
      business: req.business._id
    });

    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    res.json({ message: "Offer deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createOffer,
  getMyOffers,
  getPublicOffersForBusiness,
  updateOffer,
  deleteOffer
};
