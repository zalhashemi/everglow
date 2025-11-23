const Booking = require("../models/Booking");
const Service = require("../models/Service");
const CustomerLoyalty = require("../models/CustomerLoyalty");
const Business = require("../models/Business");

// Map JS getDay() -> schedule keys
const DAY_KEYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

/* ============================================================
   CUSTOMER: CREATE BOOKING
   POST /api/bookings
============================================================ */
const createBookingAsCustomer = async (req, res) => {
  try {
    const { businessId, serviceId, startTime, notes, staffIndex } = req.body;

    if (!businessId || !serviceId || !startTime) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (staffIndex === undefined || staffIndex === null) {
      return res.status(400).json({ message: "Staff selection is required" });
    }

    const service = await Service.findOne({
      _id: serviceId,
      business: businessId,
    });
    if (!service) {
      return res
        .status(404)
        .json({ message: "Service not found for this business" });
    }

    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    const staffArray = business.staff || [];
    const index = Number(staffIndex);

    if (Number.isNaN(index) || index < 0 || index >= staffArray.length) {
      return res.status(400).json({ message: "Invalid staff selection" });
    }

    const staffMember = staffArray[index];

    const staffName =
      (staffMember.fullName && staffMember.fullName.trim()) ||
      (staffMember.role && staffMember.role.trim()) ||
      `Staff ${index + 1}`;

    const slotStart = new Date(startTime);
    if (isNaN(slotStart.getTime())) {
      return res.status(400).json({ message: "Invalid startTime" });
    }

    // Prevent double booking of the same business + staff + time
    const existing = await Booking.findOne({
      business: businessId,
      staffIndex: index,
      startTime: slotStart,
      status: { $ne: "cancelled" },
    });
    if (existing) {
      return res.status(400).json({
        message: "This staff member is already booked at that time",
      });
    }

    // IMPORTANT: set `service: serviceId`
    const booking = await Booking.create({
      business: businessId,
      service: serviceId,
      customer: req.customer._id,
      startTime: slotStart,
      status: "pending",
      notes,
      staffIndex: index,
      staffName,
    });

    // Loyalty: +1 point up to max 5
    let loyalty = await CustomerLoyalty.findOne({
      business: businessId,
      customer: req.customer._id,
    });

    if (!loyalty) {
      loyalty = await CustomerLoyalty.create({
        business: businessId,
        customer: req.customer._id,
        points: 1,
      });
    } else if (loyalty.points < 5) {
      loyalty.points += 1;
      loyalty.lastUpdated = new Date();
      await loyalty.save();
    }

    return res
      .status(201)
      .json({ message: "Booking created", booking, loyalty });
  } catch (err) {
    console.error("Error in createBookingAsCustomer:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================
   CUSTOMER: GET MY BOOKINGS
   GET /api/bookings/me
============================================================ */
const getBookingsForCustomer = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.customer._id })
      .populate({
        path: "business",
        select: "businessName address city profileImageUrl",
      })
      .populate({
        path: "service",
        select: "name durationMinutes priceBHD description",
      })
      .sort({ startTime: 1 });

    const result = bookings.map((b) => ({
      _id: b._id,
      business: b.business,
      services: b.service ? [b.service] : [],
      startTime: b.startTime,
      status: b.status,
      staffName: b.staffName || null,
    }));

    res.json(result);
  } catch (err) {
    console.error("Error in getBookingsForCustomer:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================
   BUSINESS: GET BOOKINGS
   GET /api/bookings/business
============================================================ */
const getBookingsForMyBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.business._id).select("staff");
    const staffArray = business?.staff || [];

    const bookings = await Booking.find({ business: req.business._id })
      .populate("customer")
      .populate("service")
      .sort({ startTime: 1 });

    const enriched = bookings.map((b) => {
      const obj = b.toObject();

      if (
        obj.staffIndex !== undefined &&
        obj.staffIndex !== null &&
        staffArray.length > 0
      ) {
        const idx = obj.staffIndex;
        const member = staffArray[idx];

        if (member) {
          obj.staffName =
            (member.fullName && member.fullName.trim()) ||
            (member.role && member.role.trim()) ||
            `Staff ${idx + 1}`;
        }
      }

      return obj;
    });

    res.json(enriched);
  } catch (err) {
    console.error("Error in getBookingsForMyBusiness:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================
   BUSINESS: UPDATE STATUS
   PATCH /api/bookings/business/:id/status
============================================================ */
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["pending", "confirmed", "cancelled", "completed"];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, business: req.business._id },
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Status updated", booking });
  } catch (err) {
    console.error("Error in updateBookingStatus:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================
   STAFF AVAILABLE FOR SPECIFIC SLOT
   GET /api/bookings/available-staff?businessId=...&startTime=YYYY-MM-DDTHH:mm
============================================================ */
const getAvailableStaffForSlot = async (req, res) => {
  try {
    const { businessId, startTime } = req.query;

    if (!businessId || !startTime) {
      return res
        .status(400)
        .json({ message: "businessId and startTime are required" });
    }

    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    const [datePart, timePartRaw] = String(startTime).split("T");
    if (!datePart || !timePartRaw) {
      return res.status(400).json({ message: "Invalid startTime format" });
    }

    const timeStr = timePartRaw.substring(0, 5); // HH:mm
    const dateObj = new Date(datePart);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({ message: "Invalid date in startTime" });
    }

    const dayIndex = dateObj.getDay();
    const dayKey = DAY_KEYS[dayIndex];

    // business-level hours
    const businessHoursRaw =
      business.operatingHours && business.operatingHours[dayKey];

    let businessOpen = null;
    let businessClose = null;
    let businessClosed = false;

    if (businessHoursRaw) {
      const trimmed = String(businessHoursRaw).trim();
      if (!trimmed || trimmed.toLowerCase() === "closed") {
        businessClosed = true;
      } else {
        const parts = trimmed.split("-");
        if (parts.length === 2) {
          businessOpen = parts[0].trim();
          businessClose = parts[1].trim();
        }
      }
    }

    if (businessClosed || !businessOpen || !businessClose) {
      return res.json({ staff: [] });
    }

    const slotDateTime = new Date(startTime);
    const existingBookings = await Booking.find({
      business: businessId,
      startTime: slotDateTime,
      status: { $ne: "cancelled" },
    });

    const bookedIndexes = new Set(
      existingBookings
        .map((b) => b.staffIndex)
        .filter((v) => v !== undefined && v !== null)
    );

    const staffArray = business.staff || [];

    const available = staffArray
      .map((member, index) => ({ member, index }))
      .filter(({ member, index }) => {
        if (bookedIndexes.has(index)) return false;

        const schedule = member.schedule || {};
        let daySchedule = schedule[dayKey];

        if (
          !daySchedule ||
          (!daySchedule.open && !daySchedule.close && !daySchedule.closed)
        ) {
          daySchedule = {
            open: businessOpen,
            close: businessClose,
            closed: false,
          };
        }

        if (daySchedule.closed) return false;

        const open = daySchedule.open;
        const close = daySchedule.close;

        if (!open || !close) return false;

        if (open > timeStr || timeStr >= close) return false;

        return true;
      })
      .map(({ member, index }) => ({
        index,
        fullName: member.fullName || member.name || "Staff",
        role: member.role || "",
      }));

    res.json({ staff: available });
  } catch (err) {
    console.error("Error in getAvailableStaffForSlot:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================
   AVAILABLE TIME SLOTS
   GET /api/bookings/available-slots/:businessId?date=YYYY-MM-DD&duration=MIN
============================================================ */

const timeStrToMinutes = (str) => {
  const [h, m] = str.split(":").map(Number);
  return h * 60 + m;
};

const minutesToTimeStr = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

const getAvailableSlots = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { date, duration } = req.query;

    if (!businessId || !date || !duration) {
      return res
        .status(400)
        .json({ message: "businessId, date and duration are required" });
    }

    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    const dayNames = DAY_KEYS;

    const dayIndex = new Date(date).getDay();
    const dayKey = dayNames[dayIndex];

    const hoursForDay =
      business.operatingHours && business.operatingHours[dayKey];

    if (!hoursForDay) {
      return res.json([]);
    }

    const hoursTrimmed = String(hoursForDay).trim();
    if (!hoursTrimmed || hoursTrimmed.toLowerCase() === "closed") {
      return res.json([]);
    }

    const parts = hoursTrimmed.split("-");
    if (parts.length !== 2) {
      return res
        .status(500)
        .json({ message: "Invalid operating hours format in database" });
    }

    const openStr = parts[0].trim();
    const closeStr = parts[1].trim();

    const openMinutes = timeStrToMinutes(openStr);
    const closeMinutes = timeStrToMinutes(closeStr);
    const durationMinutes = parseInt(duration, 10);

    if (Number.isNaN(durationMinutes) || durationMinutes <= 0) {
      return res.status(400).json({ message: "Invalid duration value" });
    }

    const bookings = await Booking.find({
      business: businessId,
      status: { $ne: "cancelled" },
    });

    const takenTimes = new Set();
    for (const b of bookings) {
      if (!b.startTime) continue;
      const d = new Date(b.startTime);
      const dDate = d.toISOString().slice(0, 10);
      if (dDate !== date) continue;
      const dTime = d.toISOString().slice(11, 16);
      takenTimes.add(dTime);
    }

    const STEP = 15;
    const result = [];

    for (
      let t = openMinutes;
      t + durationMinutes <= closeMinutes;
      t += STEP
    ) {
      const timeStr = minutesToTimeStr(t);
      if (takenTimes.has(timeStr)) continue;
      result.push(timeStr);
    }

    return res.json(result);
  } catch (err) {
    console.error("Error in getAvailableSlots:", err);
    return res
      .status(500)
      .json({ message: "Failed to load available slots" });
  }
};

/* ============================================================
   CUSTOMER: CANCEL BOOKING
   PATCH /api/bookings/:id/cancel
============================================================ */
const cancelBookingAsCustomer = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      customer: req.customer._id,
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status === "completed") {
      return res
        .status(400)
        .json({ message: "Completed bookings cannot be cancelled" });
    }

    if (booking.status === "cancelled") {
      return res.json({ message: "Booking already cancelled", booking });
    }

    const updated = await Booking.findOneAndUpdate(
      { _id: booking._id },
      { status: "cancelled" },
      { new: true } // validators off by default -> safe even for old docs
    );

    return res.json({ message: "Booking cancelled", booking: updated });
  } catch (err) {
    console.error("Error in cancelBookingAsCustomer:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================
   CUSTOMER: RESCHEDULE BOOKING
   PATCH /api/bookings/:id/reschedule
============================================================ */
const rescheduleBookingAsCustomer = async (req, res) => {
  try {
    const { startTime, staffIndex, notes } = req.body;

    if (!startTime) {
      return res.status(400).json({ message: "startTime is required" });
    }
    if (staffIndex === undefined || staffIndex === null) {
      return res.status(400).json({ message: "staffIndex is required" });
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      customer: req.customer._id,
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status === "cancelled" || booking.status === "completed") {
      return res.status(400).json({
        message: "Only pending or confirmed bookings can be rescheduled",
      });
    }

    const business = await Business.findById(booking.business);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    const staffArray = business.staff || [];
    const index = Number(staffIndex);

    if (Number.isNaN(index) || index < 0 || index >= staffArray.length) {
      return res.status(400).json({ message: "Invalid staff selection" });
    }

    const staffMember = staffArray[index];
    const staffName =
      (staffMember.fullName && staffMember.fullName.trim()) ||
      (staffMember.role && staffMember.role.trim()) ||
      `Staff ${index + 1}`;

    const newStart = new Date(startTime);
    if (isNaN(newStart.getTime())) {
      return res.status(400).json({ message: "Invalid startTime" });
    }

    const conflict = await Booking.findOne({
      _id: { $ne: booking._id },
      business: booking.business,
      staffIndex: index,
      startTime: newStart,
      status: { $ne: "cancelled" },
    });

    if (conflict) {
      return res.status(400).json({
        message: "This staff member is already booked at that time",
      });
    }

    const update = {
      startTime: newStart,
      staffIndex: index,
      staffName,
      status: "pending",
    };
    if (notes !== undefined) {
      update.notes = notes;
    }

    const updated = await Booking.findOneAndUpdate(
      { _id: booking._id },
      update,
      { new: true }
    );

    return res.json({ message: "Booking rescheduled", booking: updated });
  } catch (err) {
    console.error("Error in rescheduleBookingAsCustomer:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createBookingAsCustomer,
  getBookingsForCustomer,
  getBookingsForMyBusiness,
  updateBookingStatus,
  getAvailableStaffForSlot,
  getAvailableSlots,
  cancelBookingAsCustomer,
  rescheduleBookingAsCustomer,
};
