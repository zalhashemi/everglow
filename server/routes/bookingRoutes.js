const express = require("express");
const router = express.Router();
const {
  createBookingAsCustomer,
  getBookingsForMyBusiness,
  updateBookingStatus
} = require("../controllers/bookingController");

const { protectCustomer } = require("../middleware/customerAuthMiddleware");
const { protectBusiness } = require("../middleware/authMiddleware");

// Customer creates booking
router.post("/", protectCustomer, createBookingAsCustomer);

// Business views & updates bookings
router.get("/business", protectBusiness, getBookingsForMyBusiness);
router.patch("/business/:id/status", protectBusiness, updateBookingStatus);

module.exports = router;
