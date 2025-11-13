const express = require("express");
const router = express.Router();

const {
  registerCustomer,
  loginCustomer,
  getMyCustomerProfile,
  updateMyCustomerProfile,
  getMyBookings,
  createCustomerBooking
} = require("../controllers/customerController");

const {
  protectCustomer
} = require("../middleware/customerAuthMiddleware");

// PUBLIC
router.post("/register", registerCustomer);
router.post("/login", loginCustomer);

// PROTECTED
router.get("/me", protectCustomer, getMyCustomerProfile);
router.put("/me", protectCustomer, updateMyCustomerProfile);
router.get("/me/bookings", protectCustomer, getMyBookings);
router.post("/bookings", protectCustomer, createCustomerBooking);

module.exports = router;
