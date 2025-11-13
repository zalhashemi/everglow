const express = require("express");
const router = express.Router();

const {
  getAllBusinesses,
  getBusinessDetails
} = require("../controllers/publicBusinessController");

// Public browsing
router.get("/", getAllBusinesses);
router.get("/:id", getBusinessDetails);

module.exports = router;
