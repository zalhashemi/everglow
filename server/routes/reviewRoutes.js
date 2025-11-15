const express = require("express");
const router = express.Router();
const {
  createReview,
  getBusinessReviews,
  getMyReviews
} = require("../controllers/reviewController");
const { protectCustomer } = require("../middleware/customerAuthMiddleware");

// Customer posts review
router.post("/", protectCustomer, createReview);

// Public: get reviews for business
router.get("/business/:businessId", getBusinessReviews);

// Customer: get own reviews
router.get("/me", protectCustomer, getMyReviews);

module.exports = router;
