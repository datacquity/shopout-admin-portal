const router = require('express').Router();
const handleError = require('../../../../error_handling/handler');
const User = require('../../../../models/entities/user-schema');
const Booking = require('../../../../models/operations/booking-schema');
const verifySession = require('../../auth/verifySession');

// add co-buyer to an existing booking
router.post('/', async (req, res) => {
  const { details, bookingID } = req.body;
  try {
    const booking = await Booking.findByIdAndUpdate(bookingID, {
      $push: { coBuyers: { name: details.name, phone: Number(details.phone) } },
    });
    res.status(200).json({ success: 'Added co-buyer' });
  } catch (e) {
    handleError(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// fetch role
router.post('/fetch', async (req, res) => {
  const { uid, bookingID } = req.body;
  try {
    const booking = await Booking.findById(bookingID);
    console.log(booking.coBuyers.findIndex((o) => o.uid === uid));
    if (booking.coBuyers.findIndex((o) => o.uid === uid) !== -1) {
      return res.status(200).json({ role: 'Co-Buyer' });
    }
    if (booking.coSellers.findIndex((o) => o.uid === uid) !== -1) {
      return res.status(200).json({ role: 'Co-Seller' });
    }
    throw Error('Error');
  } catch (e) {
    handleError(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update uid
router.post('/update', async (req, res) => {
  const { details, bookingID } = req.body;
  console.log(details, bookingID);
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: bookingID, 'coBuyers.phone': Number(details.phone) },
      {
        $set: { 'coBuyers.$.uid': details.uid },
      }
    );
    res.status(200).json({ success: 'Updated co-buyer' });
  } catch (e) {
    handleError(e);
    res.status(501).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
