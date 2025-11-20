// server/controllers/loyaltyController.js
const Loyalty = require("../models/Loyalty");
const Business = require("../models/Business");

/**
 * GET /api/loyalty/:businessId
 * Returns loyalty settings for the given business.
 * If none exist yet, creates a default doc and returns it.
 */
const getBusinessLoyalty = async (req, res) => {
  try {
    const { businessId } = req.params;

    let loyalty = await Loyalty.findOne({ business: businessId });

    if (!loyalty) {
      // create default config for this business
      loyalty = await Loyalty.create({
        business: businessId,
        enabled: false,
        type: "points",
        pointsPerBooking: 1,
        rewardThreshold: 5,
        rewardDescription: "",
        expiryMonths: 0,
        rewards: [],
      });

      // mirror defaults on Business
      const mirror = await Business.findByIdAndUpdate(
        businessId,
        {
          $set: {
            "loyalty.enabled": false,
            "loyalty.type": "points",
            "loyalty.pointsPerBooking": 1,
            "loyalty.rewardThreshold": 5,
            "loyalty.rewardDescription": "",
            "loyalty.expiryMonths": 0,
            "loyalty.rewards": [],
            loyaltyEnabled: false,
          },
        },
        { new: true }
      );
      console.log("Created default loyalty + mirrored to business:", mirror?._id);
    }

    res.json(loyalty);
  } catch (err) {
    console.error("Error getting business loyalty:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * PUT /api/loyalty/:businessId
 * Updates loyalty settings for the given business.
 */
const updateBusinessLoyalty = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { enabled, rewards } = req.body;

    let loyalty = await Loyalty.findOne({ business: businessId });

    if (!loyalty) {
      loyalty = new Loyalty({
        business: businessId,
        type: "points",
        pointsPerBooking: 1,
        rewardThreshold: 5,
        expiryMonths: 0,
        rewards: [],
      });
    }

    // --- normalize rewards ---
    const cleanedRewards = Array.isArray(rewards)
      ? rewards
          .map((r) => (r || "").trim())
          .filter((r) => r.length > 0)
      : loyalty.rewards || [];

    // --- normalize enabled (handles boolean or string) ---
    let nextEnabled = loyalty.enabled ?? false;
    if (typeof enabled === "boolean") {
      nextEnabled = enabled;
    } else if (typeof enabled === "string") {
      const lowered = enabled.toLowerCase();
      nextEnabled = lowered === "true" || lowered === "1" || lowered === "yes";
    }

    // update Loyalty collection (source of truth)
    loyalty.enabled = nextEnabled;
    loyalty.type = "points";
    loyalty.pointsPerBooking = 1;
    loyalty.rewardThreshold = 5;
    loyalty.expiryMonths = 0;
    loyalty.rewards = cleanedRewards;
    loyalty.rewardDescription =
      cleanedRewards[0] || loyalty.rewardDescription || "";

    await loyalty.save();

    // mirror onto Business document with $set
    const businessMirror = await Business.findByIdAndUpdate(
      businessId,
      {
        $set: {
          "loyalty.enabled": nextEnabled,
          "loyalty.type": "points",
          "loyalty.pointsPerBooking": 1,
          "loyalty.rewardThreshold": 5,
          "loyalty.rewardDescription": cleanedRewards[0] || "",
          "loyalty.expiryMonths": 0,
          "loyalty.rewards": cleanedRewards,
          loyaltyEnabled: nextEnabled,
        },
      },
      { new: true }
    );

    console.log(
      "Mirrored loyalty to business:",
      businessMirror?._id,
      "enabled=",
      businessMirror?.loyalty?.enabled
    );

    res.json(loyalty);
  } catch (err) {
    console.error("Error updating business loyalty:", err);
    res.status(500).jsonthi({ message: "Server error" });
  }
};

module.exports = {
  getBusinessLoyalty,
  updateBusinessLoyalty,
};
