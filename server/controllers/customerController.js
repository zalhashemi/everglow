const Customer = require("../models/Customer");
const Booking = require("../models/Booking");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// REGISTER CUSTOMER
const registerCustomer = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const exists = await Customer.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);

    const customer = await Customer.create({
      name,
      email,
      passwordHash,
      phone
    });

    res.status(201).json({
      message: "Customer registered",
      token: generateToken(customer._id),
      customer
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN CUSTOMER
const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    const customer = await Customer.findOne({ email });
    if (!customer)
      return res.status(400).json({ message: "Invalid email or password" });

    const match = await bcrypt.compare(password, customer.passwordHash);
    if (!match)
      return res.status(400).json({ message: "Invalid email or password" });

    res.json({
      message: "Customer logged in",
      token: generateToken(customer._id),
      customer
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET MY PROFILE
const getMyCustomerProfile = async (req, res) => {
  res.json(req.customer);
};

// UPDATE PROFILE
const updateMyCustomerProfile = async (req, res) => {
  const updates = req.body;
  const updated = await Customer.findByIdAndUpdate(req.customer._id, updates, {
    new: true
  });

  res.json({ message: "Updated", customer: updated });
};

// GET CUSTOMER BOOKING HISTORY
const getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ customerEmail: req.customer.email })
    .populate("service")
    .sort({ startTime: -1 });

  res.json(bookings);
};

// CREATE BOOKING
const createCustomerBooking = async (req, res) => {
  try {
    const { serviceId, businessId, startTime, notes } = req.body;

    const booking = await Booking.create({
      service: serviceId,
      business: businessId,
      customerName: req.customer.name,
      customerEmail: req.customer.email,
      customerPhone: req.customer.phone,
      startTime,
      notes
    });

    res.status(201).json({ message: "Booking created", booking });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerCustomer,
  loginCustomer,
  getMyCustomerProfile,
  updateMyCustomerProfile,
  getMyBookings,
  createCustomerBooking
};
