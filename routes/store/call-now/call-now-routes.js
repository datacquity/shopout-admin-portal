const router = require('express').Router();
const axios = require('axios');
const User = require('../../../models/entities/user-schema');
const Business = require('../../../models/entities/business-schema');
const Callnow = require('../../../models/operations/call-now-schema');
const handleError = require('../../../error_handling/handler');
const verifySession = require('../auth/verifySession');

// Get top requested callback
// router.post('/callback', async (req, res) => {
//   const { businessID, cred } = req.body;
//   try {
//     const callbacks = Callnow.find({
//       business: businessID,
//       status: 'callback',
//     })
//       .sort({ createdAt: -1 })
//       .poulate({
//         path: 'user',
//         select: 'firstName lastName avatar',
//       });
//     res.status(200).json({ callbacks });
//   } catch (e) {
//     handleError(e);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// });

// Fetch next entry
router.post('/fetch', async (req, res) => {
  const { businessID, cred } = req.body;
  try {
    const callnows = Callnow.find({
      business: businessID,
      status: 'callback',
    })
      .sort({ createdAt: -1 })
      .poulate({
        path: 'user',
        select: 'firstName lastName avatar phone',
      });
    if (callnows.length === 0) {
      return res.status(404).json({ error: 'No user in queue!' });
    }
    res.status(200).json({ callnow: callnows[0] });
  } catch (e) {
    handleError(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// After call ends
router.post('/endcall', async (req, res) => {
  const { callID, details, cred } = req.body;
  try {
    const call = await Callnow.findByIdAndUpdate(callID, {
      status: 'completed',
      start: details.start,
      end: details.end,
    });
    res.status(200).json({ success: 'Call ended' });
  } catch (e) {
    handleError(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
