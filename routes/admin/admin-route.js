const express = require("express");
const router = express.Router();

// Create Business
const getCategory = require("./category/fetch-category");
router.use("/category", getCategory);

// Fetch details regarding bookings and events (demoBooking)
const getDetails = require("./bookings-&-events/fetch-info");
router.use("/bookings", getDetails);

module.exports = router;
