const express = require("express");
const router = express.Router();

const { getAllActiveOffers } = require("../controllers/publicOffersController");

// Get all active offers across all salons
router.get("/", getAllActiveOffers);

module.exports = router;
