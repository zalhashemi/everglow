const Booking = require("../models/Booking");
const Service = require("../models/Service");
const CustomerLoyalty = require("../models/CustomerLoyalty");

// CUSTOMER CREATES BOOKING
const createBookingAsCustomer = async (req, res) => {
  try {
    const { businessId, serviceId, startTime, notes } = req.body;

    if (!businessId || !serviceId || !startTime) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const service = await Service.findOne({
      _id: serviceId,
      business: businessId
    });
    if (!service) {
      return res.status(404).json({ message: "Service not found for this business" });
    }

    // Prevent double booking of same business & time
    const existing = await Booking.findOne({
      business: businessId,
      startTime: new Date(startTime)
    });
    if (existing) {
      return res.status(400).json({ message: "Time slot already booked" });
    }

    const booking = await Booking.create({
      business: businessId,
      service: serviceId,
      customer: req.customer._id,
      startTime: new Date(startTime),
      status: "pending",
      notes
    });

    // Loyalty: +1 point per booking, max 5
    let loyalty = await CustomerLoyalty.findOne({
      business: businessId,
      customer: req.customer._id
    });

    if (!loyalty) {
      loyalty = await CustomerLoyalty.create({
        business: businessId,
        customer: req.customer._id,
        points: 1
      });
    } else if (loyalty.points < 5) {
      loyalty.points += 1;
      loyalty.lastUpdated = new Date();
      await loyalty.save();
    }

    res.status(201).json({ message: "Booking created", booking, loyalty });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// BUSINESS VIEW BOOKINGS
const getBookingsForMyBusiness = async (req, res) => {
  try {
    const bookings = await Booking.find({ business: req.business._id })
      .populate("customer")
      .populate("service")
      .sort({ startTime: 1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// BUSINESS UPDATE BOOKING STATUS
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
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createBookingAsCustomer,
  getBookingsForMyBusiness,
  updateBookingStatus
};
