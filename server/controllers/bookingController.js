const Booking = require("../models/Booking");
const Service = require("../models/Service");

// GET BOOKINGS FOR BUSINESS
const getBookingsForMyBusiness = async (req, res) => {
  const bookings = await Booking.find({ business: req.business._id })
    .populate("service")
    .sort({ startTime: 1 });

  res.json(bookings);
};

// UPDATE BOOKING STATUS
const updateBookingStatus = async (req, res) => {
  const { status } = req.body;

  const allowed = ["pending", "confirmed", "cancelled", "completed"];
  if (!allowed.includes(status))
    return res.status(400).json({ message: "Invalid status" });

  const booking = await Booking.findOneAndUpdate(
    { _id: req.params.id, business: req.business._id },
    { status },
    { new: true }
  );

  if (!booking) return res.status(404).json({ message: "Booking not found" });

  res.json({ message: "Status updated", booking });
};

// CREATE BOOKING (test or customer later)
const createBooking = async (req, res) => {
  const { serviceId, startTime, customerName, customerEmail, customerPhone, notes } =
    req.body;

  const service = await Service.findOne({
    _id: serviceId,
    business: req.business._id
  });

  if (!service) return res.status(404).json({ message: "Service not found" });

  const booking = await Booking.create({
    business: req.business._id,
    service: serviceId,
    startTime,
    customerName,
    customerEmail,
    customerPhone,
    notes
  });

  res.status(201).json({ message: "Booking created", booking });
};

module.exports = {
  getBookingsForMyBusiness,
  updateBookingStatus,
  createBooking
};
