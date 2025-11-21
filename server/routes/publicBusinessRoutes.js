const express = require("express");
const router = express.Router();

const {
  getAllBusinesses,
  getBusinessDetails,
} = require("../controllers/publicBusinessController");

const { getPublicOffersForBusiness } = require("../controllers/offerController");

// ===============================
// GET ALL BUSINESSES (homepage list)
// ===============================
router.get("/", getAllBusinesses);

// ===============================
// GET SINGLE BUSINESS DETAILS 
// ===============================
router.get("/:id", getBusinessDetails);

// ===============================
// GET ACTIVE OFFERS FOR A SPECIFIC BUSINESS
// ===============================
router.get("/:businessId/offers", getPublicOffersForBusiness);

module.exports = router;
