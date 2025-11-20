// server/routes/bookingRoutes.js
const express = require("express");
const router = express.Router();

const {
  createBookingAsCustomer,
  getBookingsForMyBusiness,
  updateBookingStatus,
  getAvailableSlots,
  getCustomerBookings,
  updateBookingAsCustomer,
  getSingleBooking
} = require("../controllers/bookingController");

const { protectCustomer } = require("../middleware/customerAuthMiddleware");
const { protectBusiness } = require("../middleware/authMiddleware");

// Customer: create booking
router.post("/", protectCustomer, createBookingAsCustomer);

// Customer: get my bookings
router.get("/me", protectCustomer, getCustomerBookings);

// Customer: get free slots
router.get("/available-slots/:businessId", protectCustomer, getAvailableSlots);

// Customer: view single booking (receipt)
router.get("/:id", protectCustomer, getSingleBooking);

// Customer: cancel/reschedule
router.patch("/:id", protectCustomer, updateBookingAsCustomer);

// Business: view all bookings
router.get("/business", protectBusiness, getBookingsForMyBusiness);

// Business: update booking status
router.patch("/business/:id/status", protectBusiness, updateBookingStatus);

module.exports = router;
