const Review = require("../models/Review");

// CUSTOMER CREATES REVIEW
const createReview = async (req, res) => {
  try {
    const { businessId, rating, comment } = req.body;

    if (!businessId || !rating) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const review = await Review.create({
      business: businessId,
      customer: req.customer._id,
      rating,
      comment
    });

    res.status(201).json({ message: "Review created", review });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL REVIEWS FOR A BUSINESS (public)
const getBusinessReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ business: req.params.businessId })
      .populate("customer", "firstName lastName")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET REVIEWS FOR LOGGED-IN CUSTOMER
const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ customer: req.customer._id })
      .populate("business", "businessName city");

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createReview,
  getBusinessReviews,
  getMyReviews
};
