const express = require("express");
const router = express.Router();
const {
  registerBusiness,
  loginBusiness,
  getMyBusinessProfile,
  updateMyBusinessProfile
} = require("../controllers/businessController");
const { protectBusiness } = require("../middleware/authMiddleware");

router.post("/register", registerBusiness);
router.post("/login", loginBusiness);
router.get("/me", protectBusiness, getMyBusinessProfile);
router.put("/me", protectBusiness, updateMyBusinessProfile);

module.exports = router;
