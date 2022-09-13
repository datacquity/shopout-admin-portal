/* eslint-disable prettier/prettier */
/* eslint-disable no-return-assign */
const express = require('express');

const router = express.Router();

const verifySession = require('../auth/verifySession');
const handleError = require('../../../error_handling/handler');

// const reviewLiveEvent = require('../../../models/operations/review-live-event-schema');
// const Store = require('../../../models/entities/store-schema');
const User = require('../../../models/entities/user-schema');
const { createStub } = require('../../../controllers/authentication');
const Invites = require('../../../models/operations/store-invite');
// const Booking = require('../../../models/operations/booking-schema');

// View an invite
router.post('/view', async (req, res) => {
  try {
    const { _id } = req.body;
    const invite = await Invites.findById(_id).populate({
      path: 'store',
      populate: {
        path: 'business',
        select: 'display_name category title_image logo',
      },
    });
    if (invite.status !== 'ignore' && Date.now() > invite.date) {
      invite.invitee.status = 'ignore';
      await Invites.updateOne({ _id }, { status: 'ignore' });
    }
    res.status(200).json({ invite });
  } catch (error) {
    handleError(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Accept an invite
router.post('/accept', async (req, res) => {
  try {
    const { _id } = req.body;
    const invite = await Invites.findById(_id);
    if (invite.status !== 'accept') {
      invite.invitee.status = 'accept';
      invite.reason_code = '';
      await Invites.updateOne({ _id }, { 'invitee.status': 'accept', reason_code: '' });
    }
    const user = await User.findOne({ phone: invite.invitee.phone });
    if (!user) {
      const newUser = createStub({
        firstName: invite.invitee.name,
        phone: invite.invitee.phone
      });

      const temp = {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        _id: newUser._id,
        phone: newUser.phone,
        email: newUser.email,
        avatar: newUser.avatar,
      };

      res.status(200).json({
        invite, newUser, password: `shopout${temp.phone}`
      });
      return;
    }

    res.status(200).json({
      invite
    });
  } catch (error) {
    handleError(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Decline an invite
router.post('/decline', async (req, res) => {
  try {
    const { _id, code } = req.body;
    const invite = await Invites.findById(_id);
    if (invite.status !== 'decline') {
      invite.reason_code = code;
      invite.invitee.status = 'decline';
      await Invites.updateOne({ _id }, { 'invitee.status': 'decline', reason_code: code });
    }
    res.status(200).json({ invite });
  } catch (error) {
    handleError(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
