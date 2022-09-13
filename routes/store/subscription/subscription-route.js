const express = require('express');
const router = express.Router();

const verifySession = require('../auth/verifySession');
const handleError = require('../../../error_handling/handler');

const subscribed = require('../../../models/entities/subscription-schema');
const Store = require('../../../models/entities/store-schema');

router.post('/', async (req, res) => {
  try {
    const { subscriptionDetails } = req.body;
    const store = await Store.findOne({ _id: subscriptionDetails.store })
    if (!store) return res.status(400).json({ error: 'Store not found!' });
    else {
      subscriptionDetails.business = store.business;
      console.log(subscriptionDetails);
      const createSubscription = await subscribed.create(subscriptionDetails);
      if (!createSubscription) return res.status(400).json({ error: 'Subscription could not be created!' });
      else return res.status(200).json({ subscribed: 'Subscription created' });
    }
  }
  catch (error) {
    handleError(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;