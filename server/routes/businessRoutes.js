// server/routes/businessRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

// Controllers
const {
  registerBusiness,
  loginBusiness,
  getMyBusinessProfile,
  updateMyBusinessProfile,
} = require("../controllers/businessController");

// Model
const Business = require("../models/Business");

/* ===============================
   REGISTER BUSINESS (with image)
================================= */
router.post(
  "/register",
  upload.single("image"),
  registerBusiness
);

/* ===============================
   LOGIN BUSINESS
================================= */
router.post("/login", loginBusiness);

/* ===============================
   GET BUSINESS PROFILE
================================= */
router.get("/me", getMyBusinessProfile);

/* ===============================
   UPDATE BUSINESS PROFILE
================================= */
router.put("/me", updateMyBusinessProfile);

/* ===============================
   NEW: GET ALL BUSINESSES
   (This is needed for Customer HomePage)
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
