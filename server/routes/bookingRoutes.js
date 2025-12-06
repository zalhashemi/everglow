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

router.get(
  "/available-slots/:businessId",
  protectCustomer,
  getAvailableSlots
);

router.get("/available-staff", protectCustomer, getAvailableStaffForSlot);

router.get("/me", protectCustomer, getBookingsForCustomer);

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

router.post("/", protectCustomer, createBookingAsCustomer);

router.patch("/:id/cancel", protectCustomer, cancelBookingAsCustomer);

router.patch("/:id/reschedule", protectCustomer, rescheduleBookingAsCustomer);

router.get("/business", protectBusiness, getBookingsForMyBusiness);

router.patch("/business/:id/status", protectBusiness, updateBookingStatus);

module.exports = router;
