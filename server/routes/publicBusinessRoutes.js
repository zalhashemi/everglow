const express = require("express");
const router = express.Router();

const {
  getAllBusinesses,
  getBusinessDetails,
} = require("../controllers/publicBusinessController");
const { getPublicOffersForBusiness } = require("../controllers/offerController");

// PUBLIC → GET ALL BUSINESSES
// GET /api/public/businesses
router.get("/", getAllBusinesses);

// PUBLIC → GET SINGLE BUSINESS + SERVICES + OFFERS
// GET /api/public/businesses/:id
router.get("/:id", getBusinessDetails);

// PUBLIC → GET ACTIVE OFFERS FOR A SPECIFIC BUSINESS
router.get("/:businessId/offers", getPublicOffersForBusiness);

module.exports = router;
