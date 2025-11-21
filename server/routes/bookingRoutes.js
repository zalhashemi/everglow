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
  getSingleBooking,
} = require("../controllers/bookingController");

const { protectCustomer } = require("../middleware/customerAuthMiddleware");
const { protectBusiness } = require("../middleware/authMiddleware");

// ===================== BUSINESS ROUTES ===================== //

// Business: view all bookings for THIS business
router.get("/business", protectBusiness, getBookingsForMyBusiness);

// Business: update booking status
router.patch("/business/:id/status", protectBusiness, updateBookingStatus);

// ===================== CUSTOMER ROUTES ===================== //

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

module.exports = router;
