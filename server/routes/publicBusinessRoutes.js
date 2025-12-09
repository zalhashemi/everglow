const express = require("express");
const router = express.Router();

const {
  getAllBusinesses,
  getBusinessDetails,
  getTrendingBusinesses,
  getHighestRatedBusinesses,
} = require("../controllers/publicBusinessController");

const { getPublicOffersForBusiness } = require("../controllers/offerController");


router.get("/", getAllBusinesses);

router.get("/trending", getTrendingBusinesses);

router.get("/highest-rated", getHighestRatedBusinesses);

router.get("/:businessId/offers", getPublicOffersForBusiness);

router.get("/:id", getBusinessDetails);

module.exports = router;
