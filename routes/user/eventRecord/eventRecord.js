const router = require('express').Router();
const verifySession = require('../auth/verifySession');
const handleError = require('../../../error_handling/handler');
const EventRecording = require('../../../models/entities/event-recordings');
const axios = require('axios');

router.post('/list', verifySession, async (req, res) => {
  try {
    const { businessId } = req.body;

    const list = await EventRecording.find({businessId})

    res.status(200).json(list);
  } catch (e) {
    handleError(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
