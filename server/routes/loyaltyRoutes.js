// server/routes/loyaltyRoutes.js
const express = require("express");
const router = express.Router();
const {
  getBusinessLoyalty,
  updateBusinessLoyalty,
} = require("../controllers/loyaltyController");

router.get("/:businessId", getBusinessLoyalty);
router.put("/:businessId", updateBusinessLoyalty);

module.exports = router;
