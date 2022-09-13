/* eslint-disable prettier/prettier */
/* eslint-disable no-return-assign */
const express = require('express');

const router = express.Router();
const axios = require('axios');

const verifySession = require('../auth/verifySession');
const handleError = require('../../../error_handling/handler');

// const reviewLiveEvent = require('../../../models/operations/review-live-event-schema');
// const Store = require('../../../models/entities/store-schema');
const Store = require('../../../models/entities/store-schema');
const User = require('../../../models/entities/user-schema');
const Invites = require('../../../models/operations/store-invite');
// const Booking = require('../../../models/operations/booking-schema');

router.post('/create', async (req, res) => {
  try {
    // users contain the list of invitees
    // details contain store id.
    const { users, details } = req.body;
    // if (details.date <= Date.now() || details.date > Date.now() + 10) {
    //   res.status(400).json({ error: 'Invalid date' });
    //   return;
    // }
    const store = await Store.findById(details.store)
      .select('name')
      .populate('business', 'display_name');
    if (!store) return res.status(404).json({ error: 'Store does not exist!' });
    const invites = new Array(users.length);
    await Promise.all(
      users.map(async (u, i) => {
        const foundUser = await User.findOne({ phone: u.phone });
        invites[i] = await Invites.create({
          store: details.store,
          date: u.date,
          invitee: {
            name: u.name,
            phone: u.phone,
            status: foundUser ? 'joined' : 'pending',
          },
        });
        try {
          // Send invite to user here
          const res = await axios.post(
            `https://2factor.in/API/V1/${process.env.TWO_FACTOR_KEY}/ADDON_SERVICES/SEND/TSMS`,
            {
              From: 'SHPOUT',
              To: u.phone,
              TemplateName: 'RegLink',
              VAR1: `http://192.168.1.8:3000/invite/${invites[i]._id}`,
            }
          );
          console.log(res.data);
        } catch (e) {
          console.log(e);
        }
      })
    );
    res.status(200).json({ invites });
  } catch (error) {
    handleError(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
