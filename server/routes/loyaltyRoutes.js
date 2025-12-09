const express = require("express");
const router = express.Router();

const {
  getBusinessLoyalty,
  updateBusinessLoyalty,
  getMyLoyaltyPrograms,
} = require("../controllers/loyaltyController");

const { protectCustomer } = require("../middleware/customerAuthMiddleware");

router.get("/customer/me", protectCustomer, getMyLoyaltyPrograms);

router.get("/:businessId", getBusinessLoyalty);

router.put("/:businessId", updateBusinessLoyalty);

module.exports = router;
