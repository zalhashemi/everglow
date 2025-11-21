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
      comment,
    });

    res.status(201).json({ message: "Review created", review });
  } catch (err) {
    console.error("Create review error:", err);
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
    console.error("Get business reviews error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET REVIEWS FOR LOGGED-IN CUSTOMER
const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ customer: req.customer._id }).populate(
      "business",
      "businessName city"
    );

    res.json(reviews);
  } catch (err) {
    console.error("Get my reviews error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE REVIEW (for logged-in customer)
const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating) {
      return res.status(400).json({ message: "Rating is required" });
    }

    const review = await Review.findOneAndUpdate(
      { _id: req.params.id, customer: req.customer._id },
      { rating, comment },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ message: "Review updated", review });
  } catch (err) {
    console.error("Update review error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE REVIEW (for logged-in customer)
const deleteReview = async (req, res) => {
  try {
    const deleted = await Review.findOneAndDelete({
      _id: req.params.id,
      customer: req.customer._id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ message: "Review deleted" });
  } catch (err) {
    console.error("Delete review error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET REVIEWS FOR LOGGED-IN BUSINESS (for business dashboard)
const getMyBusinessReviews = async (req, res) => {
  try {
    const businessId = req.business._id;

    const reviews = await Review.find({ business: businessId })
      .populate("customer", "firstName lastName")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    console.error("Get my business reviews error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createReview,
  getBusinessReviews,
  getMyReviews,
  updateReview,
  deleteReview,
  getMyBusinessReviews,
};
