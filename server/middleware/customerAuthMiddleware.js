const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");

const protectCustomer = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Load customer, NOT business
    const customer = await Customer.findById(decoded.id);

    if (!customer) {
      return res.status(401).json({ message: "Customer not found" });
    }

    req.customer = customer; // ⭐ THIS IS WHAT YOUR CONTROLLER EXPECTS
    next();
  } catch (err) {
    console.error("Customer auth error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { protectCustomer };
