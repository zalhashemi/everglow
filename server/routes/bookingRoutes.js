const express = require("express");
const router = express.Router();

const {
  createBookingAsCustomer,
  getBookingsForCustomer,
  getBookingsForMyBusiness,
  updateBookingStatus,
  getAvailableStaffForSlot,
  getAvailableSlots,
  cancelBookingAsCustomer,
  rescheduleBookingAsCustomer,
} = require("../controllers/bookingController");

const { protectCustomer } = require("../middleware/customerAuthMiddleware");
const { protectBusiness } = require("../middleware/authMiddleware");

// Available time slots for a business
// GET /api/bookings/available-slots/:businessId?date=YYYY-MM-DD&duration=MIN
router.get(
  "/available-slots/:businessId",
  protectCustomer,
  getAvailableSlots
);

// Staff availability for a given time slot
// GET /api/bookings/available-staff?businessId=...&startTime=ISO
router.get("/available-staff", protectCustomer, getAvailableStaffForSlot);

// Customer: my bookings
// GET /api/bookings/me
router.get("/me", protectCustomer, getBookingsForCustomer);

// Customer creates booking
// POST /api/bookings
router.post("/", protectCustomer, createBookingAsCustomer);

// Customer cancels booking
// PATCH /api/bookings/:id/cancel
router.patch("/:id/cancel", protectCustomer, cancelBookingAsCustomer);

// Customer reschedules booking
// PATCH /api/bookings/:id/reschedule
router.patch("/:id/reschedule", protectCustomer, rescheduleBookingAsCustomer);

// Business: view bookings
// GET /api/bookings/business
router.get("/business", protectBusiness, getBookingsForMyBusiness);

// Business: update booking status
// PATCH /api/bookings/business/:id/status
router.patch("/business/:id/status", protectBusiness, updateBookingStatus);

module.exports = router;
