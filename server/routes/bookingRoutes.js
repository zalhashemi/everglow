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

const Booking = require("../models/Booking");

/* ============================================================
   CUSTOMER ROUTES
============================================================ */

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

// 🔹 New: Get single booking by id for receipt
// GET /api/bookings/by-id/:id
router.get("/by-id/:id", protectCustomer, async (req, res) => {
  try {
    const bookingId = req.params.id;

    const booking = await Booking.findById(bookingId)
      .populate({
        path: "business",
        select: "businessName address city profileImageUrl imageUrl",
      })
      .populate({
        path: "service",
        select: "name durationMinutes priceBHD description",
      })
      .lean();

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Match the structure used in getBookingsForCustomer:
    const result = {
      _id: booking._id,
      business: booking.business,
      services: booking.service ? [booking.service] : [],
      startTime: booking.startTime,
      status: booking.status,
      staffName: booking.staffName || null,
    };

    return res.json(result);
  } catch (err) {
    console.error("Error getting booking by ID:", err);
    return res.status(500).json({ message: "Failed to load booking" });
  }
});

// Customer creates booking
// POST /api/bookings
router.post("/", protectCustomer, createBookingAsCustomer);

// Customer cancels booking
// PATCH /api/bookings/:id/cancel
router.patch("/:id/cancel", protectCustomer, cancelBookingAsCustomer);

// Customer reschedules booking
// PATCH /api/bookings/:id/reschedule
router.patch("/:id/reschedule", protectCustomer, rescheduleBookingAsCustomer);

/* ============================================================
   BUSINESS ROUTES
============================================================ */

// Business: view bookings
// GET /api/bookings/business
router.get("/business", protectBusiness, getBookingsForMyBusiness);

// Business: update booking status
// PATCH /api/bookings/business/:id/status
router.patch("/business/:id/status", protectBusiness, updateBookingStatus);

module.exports = router;
