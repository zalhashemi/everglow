const express = require("express");
const router = express.Router();

const {
  getBookingsForMyBusiness,
  updateBookingStatus,
  createBooking
} = require("../controllers/bookingController");

const { protectBusiness } = require("../middleware/authMiddleware");

// Business booking endpoints
router.get("/business", protectBusiness, getBookingsForMyBusiness);
router.patch("/business/:id/status", protectBusiness, updateBookingStatus);

// Create booking (temporary)
router.post("/", protectBusiness, createBooking);

module.exports = router;
