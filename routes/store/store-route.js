const express = require('express');
const router = express.Router();

// Store authentication routes
const authenticationRouter = require('./auth/store-auth');
router.use('/auth', authenticationRouter);

// Store booking routes
const bookingRouter = require('./booking/store-booking');
router.use('/book', bookingRouter);

// Store detail routes
const storeDataRouter = require('./stores/store-data');
router.use('/store', storeDataRouter);

// Store subscription
const subscriptionRoute = require('./subscription/subscription-route');
router.use('/subscribe', subscriptionRoute);

// Store review for live event route
const reviewRoute = require('./review/review-route');
router.use('/review', reviewRoute);

// Create Store
const createStore = require('./store/create-store');
router.use('/create' , createStore);

// Fetch Stores
const getStores = require('./store/get-store');
router.use('/fetch' , getStores);

// Store invoices
const invoiceRoute = require('./invoice/store-invoice');
router.use('/invoice', invoiceRoute);

// Store invoices
const inviteRoute = require('./booking/store-outbound');
router.use('/invite', inviteRoute);

// Store callnow
const callNowRoute = require('./call-now/call-now-routes');
router.use('/callnow', callNowRoute);

const eventRecordRoute = require('./eventRecord/eventRecord');
router.use("/eventRecord", eventRecordRoute)

module.exports = router;
