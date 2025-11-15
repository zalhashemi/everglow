const Business = require("../models/Business");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// REGISTER BUSINESS
const registerBusiness = async (req, res) => {
  try {
    const {
      ownerFirstName,
      ownerLastName,
      email,
      password,
      phone,
      businessName,
      businessType,
      address,
      city,
      description,
      operatingHours,
      staff,
      socialLinks
    } = req.body;

    if (!ownerFirstName || !ownerLastName || !email || !password ||
        !businessName || !businessType || !address || !city) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await Business.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const business = await Business.create({
      ownerFirstName,
      ownerLastName,
      email,
      passwordHash,
      phone,
      businessName,
      businessType,
      address,
      city,
      description,
      operatingHours,
      staff,
      socialLinks,
      services: []
    });

    res.status(201).json({
      message: "Business registered successfully",
      token: generateToken(business._id),
      business
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN BUSINESS
const loginBusiness = async (req, res) => {
  try {
    const { email, password } = req.body;

    const business = await Business.findOne({ email });
    if (!business) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, business.passwordHash);
    if (!match) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      token: generateToken(business._id),
      business
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET MY BUSINESS PROFILE
const getMyBusinessProfile = async (req, res) => {
  try {
    const business = await Business.findById(req.business._id).populate("services");
    res.json(business);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE MY BUSINESS PROFILE
const updateMyBusinessProfile = async (req, res) => {
  try {
    const updates = req.body;
    const updated = await Business.findByIdAndUpdate(req.business._id, updates, {
      new: true
    }).populate("services");

    res.json({ message: "Business updated", business: updated });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerBusiness,
  loginBusiness,
  getMyBusinessProfile,
  updateMyBusinessProfile
};
