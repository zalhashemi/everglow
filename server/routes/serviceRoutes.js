const express = require("express");
const router = express.Router();

const {
  createService,
  getMyServices,
  updateService,
  deleteService,
} = require("../controllers/serviceController");
const { protectBusiness } = require("../middleware/authMiddleware");

// All routes require authenticated business
router.post("/", protectBusiness, createService);
router.get("/", protectBusiness, getMyServices);
router.put("/:id", protectBusiness, updateService);
router.delete("/:id", protectBusiness, deleteService);

module.exports = router;
