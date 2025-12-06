const express = require("express");
const router = express.Router();

const {
  registerCustomer,
  loginCustomer,
  getMyCustomerProfile,
  updateMyCustomerProfile,
  getMyBookings,
  getMyReviews
} = require("../controllers/customerController");

const { protectCustomer } = require("../middleware/customerAuthMiddleware");

router.post("/register", registerCustomer);
router.post("/login", loginCustomer);

router.get("/me", protectCustomer, getMyCustomerProfile);
router.put("/me", protectCustomer, updateMyCustomerProfile);

router.get("/me/bookings", protectCustomer, getMyBookings);
router.get("/me/reviews", protectCustomer, getMyReviews);

module.exports = router;
