// server/routes/loyaltyRoutes.js
const express = require("express");
const router = express.Router();

const {
  getBusinessLoyalty,
  updateBusinessLoyalty,
  getMyLoyaltyPrograms,
} = require("../controllers/loyaltyController");

const { protectCustomer } = require("../middleware/customerAuthMiddleware");

// ⭐ Customer's loyalty programs (PUT THIS BEFORE :businessId)
router.get("/customer/me", protectCustomer, getMyLoyaltyPrograms);

// Get loyalty program for a business
router.get("/:businessId", getBusinessLoyalty);

// Update loyalty program for a business
router.put("/:businessId", updateBusinessLoyalty);

module.exports = router;
