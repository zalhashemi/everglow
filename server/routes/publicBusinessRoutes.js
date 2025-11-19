// server/routes/publicBusinessRoutes.js
const express = require("express");
const router = express.Router();
const Business = require("../models/Business");

// PUBLIC → GET ALL BUSINESSES (used by Customer Homepage)
router.get("/", async (req, res) => {
  try {
    const businesses = await Business.find().select("-passwordHash");
    res.json(businesses);
  } catch (err) {
    console.error("Error in GET /api/public/businesses:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
