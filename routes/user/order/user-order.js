/* eslint-disable prettier/prettier */
const router = require('express').Router();
const User = require('../../../models/entities/user-schema');
const Order = require('../../../models/operations/order-schema');
const Product = require('../../../models/entities/product-schema');
const handleError = require('../../../error_handling/handler');
const verifySession = require('../auth/verifySession');
const axios = require('axios');

router.post('/create/product', async (req, res) => {
  try {
    const { product } = req.body;
    const prod = await Product.create(product);
    console.log(req.body);
    if (!prod) return res.status(400).json({ error: 'Product could not be created.' });
    return res.status(200).json({ product: prod });
  } catch (err) {
    handleError(err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// FETCH PRODUCT

router.post('/fetch/product', async (req, res) => {
  try {
    const prod = await Product.findOne({ event: req.body.event });

    if (!prod) return res.status(400).json({ error: 'Product not found' });
    if (prod.quantity === 0) return res.status(200).json({ product: prod, sold: true });

    const total = []; const payTotal = []; const discount = []; const
      tax = [];
    for (let i = 0; i < prod.price.length; i++) {
      const beforeDiscountPrice = prod.price[i];
      const discountAmount = Math.round((beforeDiscountPrice * 0.01 * prod.discount[i]) / 10) * 10;
      const discountedPrice = beforeDiscountPrice - discountAmount;
      const taxAmount = Math.round(discountedPrice * 0.01 * prod.sgst);
      const finalAmount = Math.round((discountedPrice + (2 * taxAmount) + prod.deliveryCharge[i]) / 10) * 10;

      tax.push(taxAmount);
      total.push(discountedPrice);
      discount.push(discountAmount);
      payTotal.push(finalAmount);
    }

    const prices = {
      actualPrice: prod.price,
      discount,
      total,
      tax,
      deliveryCharge: prod.deliveryCharge,
      payTotal
    };
    return res.status(200).json({ product: prod, prices });
  } catch (error) {
    handleError(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// CREATE ORDER
router.post('/create/order', async (req, res) => {
  try {
    console.log('req.body -> ', req.body)
    const {
      products,
      user,
      address,
      variant,
      amount,
      orderId,
      paymentId,
      email,
      invoiceId
    } = req.body.orderData;

    console.log(products);

    // const prod = await Product.find({ _id: product });
    // if (!prod) { return res.status(400).json({ error: 'Product not found' }); }

    const checkUser = await User.find({ _id: user });
    console.log('checkUser -> ', checkUser)
    if (!checkUser) { return res.status(401).json({ error: 'User not found' }); }

    const order = {
      product: products,
      user,
      // quantity: quantity,
      address,
      variant,
      amount,
      paymentId,
      orderId,
      date: new Date(),
      status: (paymentId) ? 'paid' : 'pending',
      email,
      invoice: invoiceId
    };
    const savedOrder = await Order.create(order);
    const userWithOrder = await User.findOneAndUpdate(
      { _id: user },
      {
        $push: { orders: savedOrder._id }
      }
    ).populate('orders');

    const userData = await User.findById(user)

    // const newQuantity = prod[0].quantity - quantity;
    // const newProd = await Product.findOneAndUpdate(
    //   { _id: product },
    //   { quantity: newQuantity }, { new: true },
    //   (err, data) => {
    //     if (err) console.error(err);
    //   }
    // );

    const sendMessage = await axios.post(
      `https://2factor.in/API/V1/${process.env.TWO_FACTOR_KEY}/ADDON_SERVICES/SEND/TSMS`,
      {
        From: 'SHPOUT',
        To: userData.phone,
        TemplateName: 'orderconfirmation',
        VAR1: `${orderId || ""}`,
      }
    );
    console.log('${orderId || ""} -> ', `${orderId || ""}`)
    console.log('sendMessage -> ', sendMessage.data)

    return res.status(200).json({
      user: userWithOrder,
      order: savedOrder,
      //   product: newProd
    });
  } catch (error) {
    handleError(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
