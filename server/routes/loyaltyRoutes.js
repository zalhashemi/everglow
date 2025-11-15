const express = require("express");
const router = express.Router();
const {
  getAllMyLoyalty,
  getMyLoyaltyForBusiness,
  redeemLoyaltyReward
} = require("../controllers/loyaltyController");
const { protectCustomer } = require("../middleware/customerAuthMiddleware");

// Customer routes
router.get("/", protectCustomer, getAllMyLoyalty);
router.get("/business/:businessId", protectCustomer, getMyLoyaltyForBusiness);
router.post("/redeem/:businessId", protectCustomer, redeemLoyaltyReward);

module.exports = router;
