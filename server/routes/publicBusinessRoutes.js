// server/routes/publicBusinessRoutes.js
const express = require("express");
const router = express.Router();
const Business = require("../models/Business");

// PUBLIC: Get all businesses for the salon list
router.get("/", async (req, res) => {
  try {
    // Return ALL fields except passwordHash
    // imageUrl will be included if it's in the schema + documents
    const businesses = await Business.find().select("-passwordHash");

    res.json(businesses);
  } catch (err) {
    console.error("Error in GET /api/public/businesses:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
