const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const { protectBusiness } = require("../middleware/authMiddleware");

const {
  registerBusiness,
  loginBusiness,
  getMyBusinessProfile,
  updateMyBusinessProfile,
  getNearbyBusinesses,
  updateBusinessProfileImage,
} = require("../controllers/businessController");

const {
  createOffer,
  getMyOffers,
  updateOffer,
  deleteOffer,
} = require("../controllers/offerController");

const Business = require("../models/Business");
const Service = require("../models/Service");

// REGISTER BUSINESS (with image)
router.post("/register", upload.single("image"), registerBusiness);

// LOGIN BUSINESS
router.post("/login", loginBusiness);

// GET NEARBY BUSINESSES (public)
router.get("/near", getNearbyBusinesses);

// GET BUSINESS PROFILE (protected)
router.get("/me", protectBusiness, getMyBusinessProfile);

// UPDATE BUSINESS PROFILE (protected)
router.put("/me", protectBusiness, updateMyBusinessProfile);

// UPDATE ONLY PROFILE IMAGE
router.post(
  "/profile-image",
  protectBusiness,
  upload.single("image"),
  updateBusinessProfileImage
);

/**
 * SERVICES FOR LOGGED-IN BUSINESS
 * Used by dashboard "Add Offer" popup to show list of services to attach.
 */
router.get("/me/services", protectBusiness, async (req, res) => {
  try {
    const services = await Service.find({ business: req.business._id }).sort({
      createdAt: 1,
    });
    res.json(services);
  } catch (err) {
    console.error("Error fetching services for business:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * OFFER ROUTES (BUSINESS-ONLY)
 */
router.post("/offers", protectBusiness, createOffer);
router.get("/offers", protectBusiness, getMyOffers);
router.put("/offers/:id", protectBusiness, updateOffer);
router.delete("/offers/:id", protectBusiness, deleteOffer);

// OPTIONAL: get all businesses (debug/admin)
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
