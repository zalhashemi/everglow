// server/controllers/loyaltyController.js

const Loyalty = require("../models/loyalty");
const Business = require("../models/Business");
const CustomerLoyalty = require("../models/CustomerLoyalty");

/* -------------------------------------------------------------------
   GET loyalty settings for a business
   Route: GET /api/loyalty/:businessId
------------------------------------------------------------------- */
const getBusinessLoyalty = async (req, res) => {
  try {
    const loyalty = await Loyalty.findOne({
      business: req.params.businessId,
    });

    if (!loyalty) {
      // default disabled config
      return res.json({
        enabled: false,
        rewardThreshold: 5,
        pointsPerBooking: 1,
      });
    }

    res.json(loyalty);
  } catch (err) {
    console.error("getBusinessLoyalty error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -------------------------------------------------------------------
   UPDATE loyalty settings for a business
   Route: PUT /api/loyalty/:businessId
------------------------------------------------------------------- */
const updateBusinessLoyalty = async (req, res) => {
  try {
    const { businessId } = req.params;

    let loyalty = await Loyalty.findOne({ business: businessId });

    if (!loyalty) {
      loyalty = new Loyalty({
        business: businessId,
        ...req.body,
      });
    } else {
      Object.assign(loyalty, req.body);
    }

    await loyalty.save();

    res.json(loyalty);
  } catch (err) {
    console.error("updateBusinessLoyalty error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -------------------------------------------------------------------
   GET all loyalty programs for logged-in customer
   Route: GET /api/loyalty/customer/me
------------------------------------------------------------------- */
const getMyLoyaltyPrograms = async (req, res) => {
  try {
    const customerId =
      req.customer?.id ||
      req.customer?._id ||
      req.user?.id;

    if (!customerId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const programs = await CustomerLoyalty.find({
      customer: customerId,
    })
      .populate({
        path: "business",
        select: "businessName loyalty",
        populate: {
          path: "loyalty",
          model: "Loyalty",
          select: "rewardDescription rewardThreshold",
        },
      })
      .lean();

    res.json(programs);
  } catch (err) {
    console.error("getMyLoyaltyPrograms error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -------------------------------------------------------------------
   EXPORTS
------------------------------------------------------------------- */
module.exports = {
  getBusinessLoyalty,
  updateBusinessLoyalty,
  getMyLoyaltyPrograms,
};
