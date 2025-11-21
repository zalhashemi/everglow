const express = require("express");
const router = express.Router();
const {
  createReview,
  getBusinessReviews,
  getMyReviews,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const { protectCustomer } = require("../middleware/customerAuthMiddleware");

// Customer posts review
router.post("/", protectCustomer, createReview);

// Customer updates a review
router.put("/:id", protectCustomer, updateReview);

// Customer deletes a review
router.delete("/:id", protectCustomer, deleteReview);

// Public: get reviews for business
router.get("/business/:businessId", getBusinessReviews);

// Customer: get own reviews
router.get("/me", protectCustomer, getMyReviews);

module.exports = router;
