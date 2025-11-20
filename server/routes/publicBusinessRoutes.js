const express = require("express");
const router = express.Router();
const Business = require("../models/Business");
const { getPublicOffersForBusiness } = require("../controllers/offerController");

// PUBLIC → GET ALL BUSINESSES
router.get("/", async (req, res) => {
  try {
    const businesses = await Business.find().select("-passwordHash");
    res.json(businesses);
  } catch (err) {
    console.error("Error in GET /api/public/businesses:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUBLIC → GET ACTIVE OFFERS FOR A SPECIFIC BUSINESS
router.get("/:businessId/offers", getPublicOffersForBusiness);

module.exports = router;
