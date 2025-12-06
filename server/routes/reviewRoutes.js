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

router.post("/", protectCustomer, createReview);

router.put("/:id", protectCustomer, updateReview);

router.delete("/:id", protectCustomer, deleteReview);

router.get("/business/:businessId", getBusinessReviews);

router.get("/me", protectCustomer, getMyReviews);

module.exports = router;
