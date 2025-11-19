// server/routes/businessRoutes.js
const express = require("express");
const router = express.Router();

// correct paths (we are inside /routes)
const upload = require("../middleware/upload");
const { protectBusiness } = require("../middleware/authMiddleware");

const {
  registerBusiness,
  loginBusiness,
  getMyBusinessProfile,
  updateMyBusinessProfile,
} = require("../controllers/businessController");

const Business = require("../models/Business");

/* ===============================
   REGISTER BUSINESS (with image)
================================= */
router.post("/register", upload.single("image"), registerBusiness);

/* ===============================
   LOGIN BUSINESS
================================= */
router.post("/login", loginBusiness);

/* ===============================
   GET BUSINESS PROFILE (protected)
================================= */
router.get("/me", protectBusiness, getMyBusinessProfile);

/* ===============================
   UPDATE BUSINESS PROFILE (protected)
================================= */
router.put("/me", protectBusiness, updateMyBusinessProfile);

/* ===============================
   GET ALL BUSINESSES (debug / admin)
================================= */
router.get("/", async (req, res) => {
  try {
    const businesses = await Business.find({});
    res.json(businesses);
  } catch (err) {
    console.error("Error fetching businesses:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
