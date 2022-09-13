// const router = require('express').Router();
// const fs = require('fs');
// const csvjson = require('csvjson');
// const Orders = require('../../models/operations/order-schema');
// const Payment = require('../../models/operations/payment-schema');

// const { writeFile } = fs;

// router.get('/report/', async (req, res) => {
//   try {
//     const { gt } = req.query;
//     const { lt } = req.query;
//     const payments = await Payment.find({
//       payment_date: { $gte: new Date(gt), $lte: new Date(lt) },
//     });
//     const orders = await Promise.all(
//       payments.map((payment) =>
//         Orders.findOne({ paymentId: payment.razorpay_payment_id }).then()
//       )
//     );

//     const combined = [];
//     for (let i = 0; i < payments.length; i++) {
//       combined[i] = payments[i] + orders[i];
//     }
//     for (let i = 0; i < payments.length; i++) {
//       combined[i] = combined[i].split(',');
//     }
//     const csvData = csvjson.toCSV(combined, { delimiter: '\n' });
//     writeFile('routes/store/Report/report3.csv', csvData, (err) => {
//       if (err) {
//         console.log(err);
//       }
//     });
//     res.status(201).send(combined);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// module.exports = router;
