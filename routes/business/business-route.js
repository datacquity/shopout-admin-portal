const express = require('express');
const router = express.Router();

// Create Business
const createBusiness = require('./business/create-business');
router.use('/create' , createBusiness);

// Get all Businesses
const getBusiness = require('./business/get-business');
router.use('/getBusiness' , getBusiness);

module.exports = router;
