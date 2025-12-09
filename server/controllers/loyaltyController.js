const Loyalty = require("../models/loyalty");
const Business = require("../models/Business");
const CustomerLoyalty = require("../models/CustomerLoyalty");

const getOrCreateLoyaltyForBusiness = async (businessId) => {
  let loyalty = await Loyalty.findOne({ business: businessId });

  if (!loyalty) {
    loyalty = new Loyalty({
      business: businessId,
      enabled: false,
      type: "points",
      pointsPerBooking: 1,
      rewardThreshold: 5,
      rewardDescription: "",
      expiryMonths: 0,
      rewards: [],
    });
    await loyalty.save();
  }

  return loyalty;
};

const getBusinessLoyalty = async (req, res) => {
  try {
    const { businessId } = req.params;

    if (!businessId) {
      return res.status(400).json({ message: "Business ID is required" });
    }

    const loyalty = await getOrCreateLoyaltyForBusiness(businessId);
    return res.json(loyalty);
  } catch (err) {
    console.error("getBusinessLoyalty error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateBusinessLoyalty = async (req, res) => {
  try {
    const { businessId } = req.params;

    if (!businessId) {
      return res.status(400).json({ message: "Business ID is required" });
    }

    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    let loyalty = await getOrCreateLoyaltyForBusiness(businessId);

    const {
      enabled,
      type,
      pointsPerBooking,
      rewardThreshold,
      rewardDescription,
      expiryMonths,
      rewards,
    } = req.body;

    if (typeof enabled === "boolean") loyalty.enabled = enabled;
    if (type) loyalty.type = type;
    if (typeof pointsPerBooking === "number")
      loyalty.pointsPerBooking = pointsPerBooking;
    if (typeof rewardThreshold === "number")
      loyalty.rewardThreshold = rewardThreshold;
    if (typeof rewardDescription === "string")
      loyalty.rewardDescription = rewardDescription;
    if (typeof expiryMonths === "number") loyalty.expiryMonths = expiryMonths;

    if (Array.isArray(rewards)) {
      loyalty.rewards = rewards;
    }

    await loyalty.save();
    business.loyalty = {
      enabled: loyalty.enabled,
      type: loyalty.type,
      pointsPerBooking: loyalty.pointsPerBooking,
      rewardThreshold: loyalty.rewardThreshold,
      rewardDescription: loyalty.rewardDescription,
      expiryMonths: loyalty.expiryMonths,
      rewards: loyalty.rewards,
    };
    business.loyaltyEnabled = loyalty.enabled;
    await business.save();

    return res.json(loyalty);
  } catch (err) {
    console.error("updateBusinessLoyalty error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


const getMyLoyaltyPrograms = async (req, res) => {
  try {
    const customerId = req.customer.id;

    const entries = await CustomerLoyalty.find({ customer: customerId })
      .populate({
        path: "business",
        select: "businessName loyalty loyaltyEnabled",
      })
      .lean();

    const filtered = entries.filter(
      (entry) => entry.business && entry.business.loyaltyEnabled
    );

    res.json(filtered);
  } catch (err) {
    console.error("getMyLoyaltyPrograms error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getBusinessLoyalty,
  updateBusinessLoyalty,
  getMyLoyaltyPrograms,
};
