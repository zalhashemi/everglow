const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");

const protectCustomer = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No customer token provided" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const customer = await Customer.findById(decoded.id);
    if (!customer) {
      return res.status(401).json({ message: "Customer not found" });
    }

    req.customer = customer;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

module.exports = { protectCustomer };
