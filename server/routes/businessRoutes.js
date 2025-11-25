// server/routes/businessRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  registerBusiness,
  loginBusiness,
  getMyBusinessProfile,
  updateMyBusinessProfile,
  updateBusinessProfileImage,
  getNearbyBusinesses,
  getBusinessDashboardStats,
} = require("../controllers/businessController");

const { protectBusiness } = require("../middleware/authMiddleware");
const { getMyBusinessReviews } = require("../controllers/reviewController");


// ---------- Multer for image uploads ----------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* ============================================================
   PUBLIC ROUTES
============================================================ */

// ✔ GET all businesses (used by homepage + map)
router.get("/", async (req, res) => {
  try {
    const Business = require("../models/Business");

    const businesses = await Business.find().select(
      "businessName businessType address city description imageUrl location genderTag"
    );

    res.json(businesses);
  } catch (err) {
    console.error("Error fetching businesses:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Business: get their own reviews
router.get("/reviews", protectBusiness, getMyBusinessReviews);


// ✔ Nearby search
router.get("/nearby", getNearbyBusinesses);

/* ============================================================
   AUTH ROUTES
============================================================ */

// Register
router.post("/register", upload.single("image"), registerBusiness);

// Login
router.post("/login", loginBusiness);

/* ============================================================
   BUSINESS (AUTH REQUIRED)
============================================================ */

// Get profile
router.get("/me", protectBusiness, getMyBusinessProfile);

// Update profile
router.put("/me", protectBusiness, upload.single("image"), updateMyBusinessProfile);

// Update ONLY profile image
router.put(
  "/me/image",
  protectBusiness,
  upload.single("image"),
  updateBusinessProfileImage
);

// Dashboard stats
router.get("/me/stats", protectBusiness, getBusinessDashboardStats);

module.exports = router;
