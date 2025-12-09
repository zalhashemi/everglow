const express = require("express");
const router = express.Router();
const {
  createOffer,
  getMyOffers,
  getPublicOffersForBusiness,
  updateOffer,
  deleteOffer
} = require("../controllers/offerController");
const { protectBusiness } = require("../middleware/authMiddleware");

router.post("/", protectBusiness, createOffer);
router.get("/my", protectBusiness, getMyOffers);
router.put("/:id", protectBusiness, updateOffer);
router.delete("/:id", protectBusiness, deleteOffer);
router.get("/public/:businessId", getPublicOffersForBusiness);

module.exports = router;
