// server/controllers/bookingController.js

const Booking = require("../models/Booking");
const Service = require("../models/Service");
const CustomerLoyalty = require("../models/CustomerLoyalty");

/* -------------------------------------------------------------
   Utility: Generate 30-minute time slots (9:00 → 21:30)
------------------------------------------------------------- */
function generateTimeSlots() {
  const slots = [];
  for (let hour = 9; hour <= 21; hour++) {
    const h = hour.toString().padStart(2, "0");
    slots.push(`${h}:00`);
    slots.push(`${h}:30`);
  }
  return slots;
}

/* -------------------------------------------------------------
   CUSTOMER: Get available slots
------------------------------------------------------------- */
const getAvailableSlots = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { date, duration } = req.query;

    if (!date || !duration)
      return res.status(400).json({ message: "Missing date or duration" });

    const totalMinutes = parseInt(duration, 10);
    const dayStart = new Date(`${date}T00:00:00`);
    const dayEnd = new Date(`${date}T23:59:59`);

    const bookings = await Booking.find({
      business: businessId,
      startTime: { $gte: dayStart, $lte: dayEnd },
    });

    const slots = generateTimeSlots();

    const free = slots.filter((slot) => {
      const start = new Date(`${date}T${slot}:00`);
      const end = new Date(start.getTime() + totalMinutes * 60000);

      const conflict = bookings.some(
        (b) =>
          (start >= b.startTime && start < b.endTime) ||
          (end > b.startTime && end <= b.endTime) ||
          (start <= b.startTime && end >= b.endTime)
      );

      return !conflict;
    });

    res.json(free);
  } catch (err) {
    console.error("getAvailableSlots error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -------------------------------------------------------------
   CUSTOMER: Create booking (multi-service)
------------------------------------------------------------- */
const createBookingAsCustomer = async (req, res) => {
  try {
    const { businessId, serviceIds, startTime, notes } = req.body;

    if (!businessId || !serviceIds?.length || !startTime)
      return res.status(400).json({ message: "Missing fields" });

    const services = await Service.find({ _id: { $in: serviceIds } });

    const totalMinutes = services.reduce(
      (sum, s) => sum + s.durationMinutes,
      0
    );

    const start = new Date(startTime);
    const end = new Date(start.getTime() + totalMinutes * 60000);

    const conflict = await Booking.findOne({
      business: businessId,
      $or: [
        { startTime: { $lt: end, $gte: start } },
        { endTime: { $gt: start, $lte: end } },
        { startTime: { $lte: start }, endTime: { $gte: end } },
      ],
    });

    if (conflict)
      return res.status(400).json({ message: "Time slot already booked" });

    const booking = await Booking.create({
      business: businessId,
      customer: req.customer._id,
      services: serviceIds,
      startTime: start,
      endTime: end,
      status: "pending",
      notes,
    });

    // Loyalty system
    let loyalty = await CustomerLoyalty.findOne({
      customer: req.customer._id,
      business: businessId,
    });

    if (!loyalty) {
      loyalty = await CustomerLoyalty.create({
        customer: req.customer._id,
        business: businessId,
        points: 1,
      });
    } else if (loyalty.points < 5) {
      loyalty.points += 1;
      await loyalty.save();
    }

    res.status(201).json({ message: "Booking created", booking, loyalty });
  } catch (err) {
    console.error("createBookingAsCustomer error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -------------------------------------------------------------
   CUSTOMER: Get all my bookings
------------------------------------------------------------- */
const getCustomerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.customer._id })
      .populate("business")
      .populate("services")
      .sort({ startTime: 1 });

    res.json(bookings);
  } catch (err) {
    console.error("getCustomerBookings error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -------------------------------------------------------------
   CUSTOMER: Get a single booking (receipt)
------------------------------------------------------------- */
const getSingleBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      customer: req.customer._id,
    })
      .populate("business")
      .populate("services");

    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    res.json(booking);
  } catch (err) {
    console.error("getSingleBooking error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -------------------------------------------------------------
   CUSTOMER: Cancel / Reschedule
------------------------------------------------------------- */
const updateBookingAsCustomer = async (req, res) => {
  try {
    const { action, newStartTime, serviceIds } = req.body;

    const booking = await Booking.findOne({
      _id: req.params.id,
      customer: req.customer._id,
    });

    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    // Cancel
    if (action === "cancel") {
      booking.status = "cancelled";
      await booking.save();
      return res.json({ message: "Booking cancelled", booking });
    }

    // Reschedule
    if (action === "reschedule") {
      const services = await Service.find({ _id: { $in: serviceIds } });

      const totalMinutes = services.reduce(
        (sum, s) => sum + s.durationMinutes,
        0
      );

      const newStart = new Date(newStartTime);
      const newEnd = new Date(newStart.getTime() + totalMinutes * 60000);

      // Conflict check
      const conflict = await Booking.findOne({
        business: booking.business,
        _id: { $ne: booking._id },
        $or: [
          { startTime: { $lt: newEnd, $gte: newStart } },
          { endTime: { $gt: newStart, $lte: newEnd } },
          { startTime: { $lte: newStart }, endTime: { $gte: newEnd } },
        ],
      });

      if (conflict)
        return res.status(400).json({ message: "Slot already taken" });

      booking.startTime = newStart;
      booking.endTime = newEnd;
      booking.services = serviceIds;
      booking.status = "pending";

      await booking.save();

      return res.json({ message: "Booking rescheduled", booking });
    }

    res.status(400).json({ message: "Invalid action" });
  } catch (err) {
    console.error("updateBookingAsCustomer error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -------------------------------------------------------------
   BUSINESS: Get all bookings for MY business
------------------------------------------------------------- */
const getBookingsForMyBusiness = async (req, res) => {
  try {
    const bookings = await Booking.find({ business: req.business._id })
      .populate("customer")
      .populate("services")
      .sort({ startTime: 1 });

    res.json(bookings);
  } catch (err) {
    console.error("getBookingsForMyBusiness error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -------------------------------------------------------------
   BUSINESS: Update booking status
------------------------------------------------------------- */
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findOne({
      _id: req.params.id,
      business: req.business._id,
    });

    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    booking.status = status;
    await booking.save();

    res.json({ message: "Status updated", booking });
  } catch (err) {
    console.error("updateBookingStatus error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -------------------------------------------------------------
   EXPORTS (FIXED — NO MISSING FUNCTIONS)
------------------------------------------------------------- */
module.exports = {
  createBookingAsCustomer,
  getAvailableSlots,
  getCustomerBookings,
  getSingleBooking,
  updateBookingAsCustomer,
  getBookingsForMyBusiness,
  updateBookingStatus,
};
