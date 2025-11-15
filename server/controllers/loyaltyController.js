const CustomerLoyalty = require("../models/CustomerLoyalty");

// GET ALL LOYALTY FOR LOGGED-IN CUSTOMER
const getAllMyLoyalty = async (req, res) => {
  try {
    const loyalty = await CustomerLoyalty.find({ customer: req.customer._id })
      .populate("business", "businessName city");
    res.json(loyalty);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET LOYALTY FOR ONE BUSINESS
const getMyLoyaltyForBusiness = async (req, res) => {
  try {
    const loyalty = await CustomerLoyalty.findOne({
      business: req.params.businessId,
      customer: req.customer._id
    }).populate("business", "businessName city");

    res.json(loyalty || { points: 0 });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// REDEEM REWARD (RESET TO 0)
const redeemLoyaltyReward = async (req, res) => {
  try {
    const loyalty = await CustomerLoyalty.findOne({
      business: req.params.businessId,
      customer: req.customer._id
    });

    if (!loyalty || loyalty.points < 5) {
      return res.status(400).json({ message: "Not enough points to redeem" });
    }

    loyalty.points = 0;
    loyalty.lastUpdated = new Date();
    await loyalty.save();

    res.json({ message: "Reward redeemed, points reset to 0", loyalty });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllMyLoyalty,
  getMyLoyaltyForBusiness,
  redeemLoyaltyReward
};
