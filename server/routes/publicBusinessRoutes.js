// server/routes/publicBusinessRoutes.js
const express = require("express");
const router = express.Router();

const {
  getAllBusinesses,
  getBusinessDetails,
} = require("../controllers/publicBusinessController");

// PUBLIC → GET ALL BUSINESSES (used by Customer Homepage)
// GET /api/public/businesses
router.get("/", getAllBusinesses);

// PUBLIC → GET SINGLE BUSINESS + SERVICES + OFFERS
// GET /api/public/businesses/:id
router.get("/:id", getBusinessDetails);

module.exports = router;
