const express = require("express");
const router = express.Router();

const { getAllActiveOffers } = require("../controllers/publicOffersController");

router.get("/", getAllActiveOffers);

module.exports = router;
