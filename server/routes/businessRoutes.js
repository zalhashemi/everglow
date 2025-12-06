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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

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


router.get("/reviews", protectBusiness, getMyBusinessReviews);



router.get("/nearby", getNearbyBusinesses);

router.post("/register", upload.single("image"), registerBusiness);

router.post("/login", loginBusiness);

router.get("/me", protectBusiness, getMyBusinessProfile);

router.put("/me", protectBusiness, upload.single("image"), updateMyBusinessProfile);

router.put(
  "/me/image",
  protectBusiness,
  upload.single("image"),
  updateBusinessProfileImage
);

router.get("/me/stats", protectBusiness, getBusinessDashboardStats);

module.exports = router;
