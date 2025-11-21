// server/controllers/bookingController.js

const Booking = require("../models/Booking");
const Service = require("../models/Service");
const CustomerLoyalty = require("../models/CustomerLoyalty");
const Loyalty = require("../models/loyalty");
const Business = require("../models/Business"); // 👈 NEW: to read operatingHours

/* -------------------------------------------------------------
   Utility: parse "HH:MM" into minutes since midnight
------------------------------------------------------------- */
function parseHHMMToMinutes(str) {
  if (!str) return null;
  const [h, m] = str.split(":").map((v) => parseInt(v, 10));
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

/* -------------------------------------------------------------
   Utility: Generate time slots for a given day & opening hours
   - openStr, closeStr: "08:30", "19:30"
   - stepMinutes: typically 30
   - totalMinutes: total duration of services for one booking
------------------------------------------------------------- */
function generateTimeSlotsForDay(openStr, closeStr, stepMinutes, totalMinutes) {
  const openMin = parseHHMMToMinutes(openStr);
  const closeMin = parseHHMMToMinutes(closeStr);

  if (
    openMin === null ||
    closeMin === null ||
    openMin >= closeMin ||
    totalMinutes <= 0
  ) {
    return [];
  }

  const slots = [];
  // we only allow a slot if start + totalMinutes <= closeMin
  for (let m = openMin; m + totalMinutes <= closeMin; m += stepMinutes) {
    const h = Math.floor(m / 60)
      .toString()
      .padStart(2, "0");
    const mm = (m % 60).toString().padStart(2, "0");
    slots.push(`${h}:${mm}`);
  }
  return slots;
}

/* -------------------------------------------------------------
   LOYALTY: Award points AFTER booking is completed
------------------------------------------------------------- */
async function applyLoyaltyForBooking(booking) {
  try {
    const businessId = booking.business;
    const customerId = booking.customer;

    // 1. Check if salon has a loyalty program enabled
    const loyaltyProgram = await Loyalty.findOne({ business: businessId });
    if (!loyaltyProgram || !loyaltyProgram.enabled) {
      return; // salon has no loyalty program → skip
    }

    const maxPoints = loyaltyProgram.rewardThreshold || 5;
    const pointsPerBooking = loyaltyProgram.pointsPerBooking || 1;

    // 2. Find existing customer loyalty entry
    let entry = await CustomerLoyalty.findOne({
      customer: customerId,
      business: businessId,
    });

    if (!entry) {
      // First time customer books at this salon
      entry = await CustomerLoyalty.create({
        customer: customerId,
        business: businessId,
        points: Math.min(pointsPerBooking, maxPoints),
      });

      return;
    }

    // 3. Add points (but not past threshold)
    entry.points = Math.min(entry.points + pointsPerBooking, maxPoints);
    entry.lastUpdated = new Date();
    await entry.save();
  } catch (err) {
    console.error("applyLoyaltyForBooking error:", err);
  }
}

/* -------------------------------------------------------------
   CUSTOMER: Get available slots
   ✅ NOW RESPECTS BUSINESS operatingHours
------------------------------------------------------------- */
const getAvailableSlots = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { date, duration } = req.query;

    if (!date || !duration) {
      return res.status(400).json({ message: "Missing date or duration" });
    }

    const totalMinutes = parseInt(duration, 10);
    if (Number.isNaN(totalMinutes) || totalMinutes <= 0) {
      return res.status(400).json({ message: "Invalid duration" });
    }

    // 1) Load business and its operatingHours
    const business = await Business.findById(businessId).select("operatingHours");
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    const jsDate = new Date(`${date}T00:00:00`);
    if (Number.isNaN(jsDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const dayKey = days[jsDate.getDay()];
    const hoursStr =
      business.operatingHours && business.operatingHours[dayKey]
        ? business.operatingHours[dayKey]
        : "";

    // 2) Closed day → no slots
    if (!hoursStr || hoursStr.toLowerCase() === "closed") {
      // return empty array → frontend will show "No available slots"
      return res.json([]);
    }

    // Expecting something like "08:30 - 19:30"
    const parts = hoursStr.split("-");
    if (parts.length !== 2) {
      // malformed, fail safe → no slots
      return res.json([]);
    }

    const openStr = parts[0].trim(); // "08:30"
    const closeStr = parts[1].trim(); // "19:30"

    // 3) Find existing bookings for that day
    const dayStart = new Date(`${date}T00:00:00`);
    const dayEnd = new Date(`${date}T23:59:59`);

    const bookings = await Booking.find({
      business: businessId,
      startTime: { $gte: dayStart, $lte: dayEnd },
    });

    // 4) Generate base slots only inside opening hours
    const baseSlots = generateTimeSlotsForDay(
      openStr,
      closeStr,
      30, // step minutes
      totalMinutes
    );

    // 5) Filter out conflicts
    const free = baseSlots.filter((slot) => {
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

    return res.json(free);
  } catch (err) {
    console.error("getAvailableSlots error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

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

    // ✔ Create the booking
    const booking = await Booking.create({
      business: businessId,
      customer: req.customer._id,
      services: serviceIds,
      startTime: start,
      endTime: end,
      status: "pending",
      notes,
    });

    // ⭐ CHECK IF BUSINESS HAS A LOYALTY PROGRAM
    const loyaltyProgram = await Loyalty.findOne({ business: businessId });

    if (loyaltyProgram && loyaltyProgram.enabled) {
      // ⭐ Check if customer already has a loyalty entry
      let entry = await CustomerLoyalty.findOne({
        customer: req.customer._id,
        business: businessId,
      });

      if (!entry) {
        // ⭐ CUSTOMER IS BOOKING FOR FIRST TIME
        entry = await CustomerLoyalty.create({
          customer: req.customer._id,
          business: businessId,
          points: 0, // start with ZERO points
        });
      } else {
        // ⭐ ADD 1 POINT FOR REPEAT BOOKINGS
        const maxPoints = loyaltyProgram.rewardThreshold || 5;
        entry.points = Math.min(entry.points + 1, maxPoints);
        entry.lastUpdated = new Date();
        await entry.save();
      }
    }

    res.status(201).json({ message: "Booking created", booking });
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
   ❗ APPLY LOYALTY HERE when status becomes "completed"
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

    // Award loyalty ONLY when completed
    if (status === "completed") {
      await applyLoyaltyForBooking(booking);
    }

    res.json({ message: "Status updated", booking });
  } catch (err) {
    console.error("updateBookingStatus error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -------------------------------------------------------------
   EXPORTS
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
