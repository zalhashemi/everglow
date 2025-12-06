const Customer = require("../models/Customer");
const Booking = require("../models/Booking");
const Review = require("../models/Review");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });


const registerCustomer = async (req, res) => {
  console.log("Request body:", req.body);

  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await Customer.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const passwordHash = await bcryptjs.hash(password, 10);

    const customer = await Customer.create({
      firstName,
      lastName,
      email,
      passwordHash
    });

    res.status(201).json({
      message: "Customer registered successfully",
      token: generateToken(customer._id),
      customer
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const match = await bcryptjs.compare(password, customer.passwordHash);
    if (!match) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      token: generateToken(customer._id),
      customer
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getMyCustomerProfile = async (req, res) => {
  res.json(req.customer);
};



const updateMyCustomerProfile = async (req, res) => {
  try {
    const updates = req.body;
    const updated = await Customer.findByIdAndUpdate(
      req.customer._id,
      updates,
      { new: true }
    );
    res.json({ message: "Customer updated", customer: updated });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.customer._id })
      .populate("business")
      .populate("service")
      .sort({ startTime: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ customer: req.customer._id })
      .populate("business");
    res.json(reviews);
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
  getMyReviews
};
