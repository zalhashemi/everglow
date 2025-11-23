// server/routes/publicBusinessRoutes.js
const express = require("express");
const router = express.Router();

const {
  getAllBusinesses,
  getBusinessDetails,
  getTrendingBusinesses,
  getHighestRatedBusinesses,
} = require("../controllers/publicBusinessController");

const { getPublicOffersForBusiness } = require("../controllers/offerController");

// ===============================
// GET ALL BUSINESSES (homepage list)
// ===============================
router.get("/", getAllBusinesses);

// ===============================
// TRENDING BUSINESSES (most bookings last month)
// ===============================
router.get("/trending", getTrendingBusinesses);

// ===============================
// HIGHEST RATED BUSINESSES
// ===============================
router.get("/highest-rated", getHighestRatedBusinesses);

// ===============================
// GET ACTIVE OFFERS FOR A SPECIFIC BUSINESS
// ===============================
router.get("/:businessId/offers", getPublicOffersForBusiness);

// ===============================
// GET SINGLE BUSINESS DETAILS
// (this MUST be last so it doesn't override the others)
// ===============================
router.get("/:id", getBusinessDetails);

module.exports = router;
