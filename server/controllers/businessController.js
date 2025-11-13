const Business = require("../models/Business");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// REGISTER BUSINESS
const registerBusiness = async (req, res) => {
  try {
    const { businessName, ownerName, email, password, phone, address, description } =
      req.body;

    if (!businessName || !ownerName || !email || !password)
      return res.status(400).json({ message: "Missing required fields" });

    const exists = await Business.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already used" });

    const passwordHash = await bcrypt.hash(password, 10);

    const business = await Business.create({
      businessName,
      ownerName,
      email,
      passwordHash,
      phone,
      address,
      description
    });

    res.status(201).json({
      message: "Registration successful",
      token: generateToken(business._id),
      business
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
const loginBusiness = async (req, res) => {
  try {
    const { email, password } = req.body;

    const business = await Business.findOne({ email });
    if (!business) return res.status(400).json({ message: "Invalid email" });

    const match = await bcrypt.compare(password, business.passwordHash);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    res.json({
      message: "Login successful",
      token: generateToken(business._id),
      business
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET OWN PROFILE
const getMyBusinessProfile = async (req, res) => {
  const data = await Business.findById(req.business._id).populate("services");
  res.json(data);
};

// UPDATE PROFILE
const updateMyBusinessProfile = async (req, res) => {
  const updates = req.body;
  const business = await Business.findByIdAndUpdate(req.business._id, updates, {
    new: true
  });

  res.json({ message: "Updated successfully", business });
};

module.exports = {
  registerBusiness,
  loginBusiness,
  getMyBusinessProfile,
  updateMyBusinessProfile
};
