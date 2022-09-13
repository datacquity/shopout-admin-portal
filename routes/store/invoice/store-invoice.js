/* eslint-disable prettier/prettier */
/* eslint-disable no-return-assign */
const express = require('express');

const router = express.Router();

const verifySession = require('../auth/verifySession');
const handleError = require('../../../error_handling/handler');

// const reviewLiveEvent = require('../../../models/operations/review-live-event-schema');
// const Store = require('../../../models/entities/store-schema');
// const Booking = require('../../../models/operations/booking-schema');
const Invoice = require('../../../models/operations/invoice-schema');

router.post('/create', async (req, res) => {
  try {
    const { bookingDetails, userDetails, invoiceDetails } = req.body;
    let invoice = new Invoice({
      booking: bookingDetails._id,
      date: Date.now(),
      note: invoiceDetails.note,
      details: invoiceDetails.details,
      delivery_price: invoiceDetails.delivery,
      discount: invoiceDetails.discount,
      amount: invoiceDetails.amount,
      user: userDetails,
    });
    invoice = await invoice.save();
    res.status(200).json({ invoice });
  } catch (error) {
    handleError(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

router.post('/update', verifySession, async (req, res) => {
  try {
    const { userDetails, invoiceDetails } = req.body;
    let data = {
      date: Date.now(),
      note: invoiceDetails.note,
      details: invoiceDetails.details,
      delivery_price: invoiceDetails.delivery,
      discount: invoiceDetails.discount,
      amount: invoiceDetails.amount,
      user: userDetails,
    }
    const invoice = await Invoice.findByIdAndUpdate(invoiceDetails._id, data);
    res.status(200).json({ invoice: {...invoice, ...data} });
  } catch (error) {
    handleError(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

router.post('/discard', verifySession, async (req, res) => {
  try {
    const { bookingDetails } = req.body;
    const invoice = await Invoice.findOneAndUpdate(
      {
        booking: bookingDetails._id,
      },
      { status: 'discard' }
    );
    res.json({ delete: true, _id: invoice._id });
  } catch (error) {
    handleError(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
