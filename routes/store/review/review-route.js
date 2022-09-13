const express = require('express');
const router = express.Router();

const verifySession = require('../auth/verifySession');
const handleError = require('../../../error_handling/handler');

const reviewLiveEvent = require('../../../models/operations/review-live-event-schema');
const Store = require('../../../models/entities/store-schema');

router.post('/', async (req, res) => {
  try {
    const { reviewDetails } = req.body;
    const store = await Store.findOne({ _id: reviewDetails.store });
    if (!store) return res.status(400).json({ error: 'Could not find store' });
    else {
      const newReviewEvent = await reviewLiveEvent.create(reviewDetails);

      if (!newReviewEvent) return res.status(400).json({ error: 'Could not submit for review.' });
      else return res.status(200).json({ review: 'Event submitted for review.' });
    }
  }
  catch (error) {
    handleError(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
})


module.exports = router;