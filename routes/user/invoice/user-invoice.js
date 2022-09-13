const router = require('express').Router();
const User = require('../../../models/entities/user-schema');
const Order = require('../../../models/operations/order-schema');
const Product = require('../../../models/entities/product-schema');
const Invoice = require('../../../models/operations/invoice-schema');
const handleError = require('../../../error_handling/handler');
const verifySession = require('../auth/verifySession');

router.post('/accept', async (req, res) => {
  try {
    const { bookingDetails } = req.body;
    let invoice = await Invoice.findOne({ booking: bookingDetails._id });
    if (!invoice) {
      return res.status(404).json({ error: 'Booking unavailable' });
    }
    invoice = await Invoice.findOneAndUpdate(
      { booking: bookingDetails._id },
      {
        status: 'accept',
      }
    );
    return res.status(200).json({ success: 'Successfully Accepted' });
  } catch (error) {
    handleError(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

router.post('/reject', async (req, res) => {
  try {
    const { bookingDetails } = req.body;
    let invoice = await Invoice.findOne({ booking: bookingDetails._id });
    if (!invoice) {
      return res.status(404).json({ error: 'Booking unavailable' });
    }

    invoice = await Invoice.findOneAndUpdate(
      { booking: bookingDetails._id },
      {
        status: 'reject',
      }
    );
    return res.status(200).json({ success: 'Rejected Successfully' });
  } catch (error) {
    handleError(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

router.post('/view', async (req, res) => {
  try {
    const { bookingDetails } = req.body;
    const invoice = await Invoice.find({
      booking: bookingDetails._id,
    })
      .sort({ createdAt: -1 })
      .select('date status details delivery_price discount amount note user');
    // .populate('booking', 'store user');
    console.log(invoice);
    if (!invoice || invoice[0].status === 'discard') {
      handleError('Invoice unavailable!');
      res.status(404).json({ error: 'Invoice unavailable!' });
      return;
    }

    const newDetails = invoice[0].details.map((d) => {
      const amount =
        Number(d.price) * Number(d.quantity) +
        Number(d.cgst) +
        Number(d.sgst) -
        Number(d.discount);
      return {
        code: d.code,
        product: d.product,
        quantity: d.quantity,
        price: d.price,
        cgst: d.cgst,
        sgst: d.sgst,
        discount: d.discount,
        amount,
      };
    });
    delete invoice[0].details;
    res.json({ invoice: invoice[0], data: newDetails });
  } catch (error) {
    handleError(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
