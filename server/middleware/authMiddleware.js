const jwt = require("jsonwebtoken");
const Business = require("../models/Business");

const protectBusiness = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const business = await Business.findById(decoded.id);
    if (!business) {
      return res.status(401).json({ message: "Business not found" });
    }

    req.business = business;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { protectBusiness };
