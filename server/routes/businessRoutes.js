// server/routes/businessRoutes.js
const express = require("express");
const router = express.Router();


const upload = require("../middleware/upload"); // ✅ this exists now

const {
  registerBusiness,
  loginBusiness,
  getMyBusinessProfile,
  updateMyBusinessProfile,
} = require("../controllers/businessController");

router.post(
  "/register",
  upload.single("image"), // ✅ multer handles multipart + image
  registerBusiness
);

router.post("/login", loginBusiness);
router.get("/me", getMyBusinessProfile);
router.put("/me", updateMyBusinessProfile);

module.exports = router;
