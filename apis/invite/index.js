const router = require('express').Router();
const axios = require('axios');
const moment = require('moment');
const twillo = require('twilio');
const mongoose = require('mongoose');
const Invites = require('../../models/operations/call-invites');
const Store = require('../../models/entities/store-schema');
const User = require('../../models/entities/user-schema');
const {
  dispatchSingleNotification,
  dispatchSingleNotificationApple,
} = require('../../utils/notification-dispatcher');
// const reverseGeocoding = require('./controllers/reverseGeocoding');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

router.post('/', async (req, res) => {
  try {
    const { appointmentId, mobileNumber, inviteFrom, shopname, name } = req.body;

    // if (!cred || !cred.type || cred.type !== 'store' || !cred.phone) {
    //   return res.status(400).send({ message: 'Unauthorized access' });
    // }

    const { firebaseToken } =
      (await User.findOne({ phone: mobileNumber })) || {};

    if (!appointmentId || !mobileNumber || !inviteFrom) {
      return res.status(400).send({ message: 'Invalid Request' });
    }

    if (!(inviteFrom == 'user' || inviteFrom == 'store')) {
      return res.status(400).send({ message: 'invalid invite' });
    }

    const webApi = process.env.DEEPLINK_WEBAPI;

    console.log('process.env.WEB_URL -> ', process.env.WEB_URL)

    const link = `${process.env.WEB_URL}?appointmentId=${appointmentId}&mobileNumber=${mobileNumber}&inviteFrom=${inviteFrom}`;
    const response = await axios.post(
      `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${webApi}`,
      {
        dynamicLinkInfo: {
          domainUriPrefix:
            inviteFrom === 'user'
              ? process.env.DEEPLINK_USER
              : process.env.DEEPLINK_STORE,
          link,
          androidInfo: {
            androidPackageName:
              inviteFrom === 'user'
                ? process.env.ANDROID_PKG_USER
                : process.env.ANDROID_PKG_STORE,
            androidFallbackLink: link,
          },
        },
      }
    );
    const { shortLink } = response.data;

    if (!shortLink) {
      return res.status(500).send({ message: 'Unable to generate url' });
    }

    const fromNumber = process.env.TWILIO_FROM_NUMBER;
    const client = twillo(accountSid, authToken);

    const title = 'You got an invite';
    const body = `Press the link below to join the call:- ${shortLink}`;
    const notificationBody = "You've been invited to join a call.";
    try {
      // client.messages
      //   .create({
      //     body,
      //     from: fromNumber,
      //     to: `+91${mobileNumber}`,
      //   })
      //   .then((message) => console.log(message));

        if(inviteFrom === 'store'){
          await axios.post(
            `https://2factor.in/API/V1/${process.env.TWO_FACTOR_KEY}/ADDON_SERVICES/SEND/TSMS`,
            {
              From: 'SHPOUT',
              To: mobileNumber,
              TemplateName: 'cosellinvite',
              VAR1: `Sales Associate`,
              VAR2: `${shopname || ""}`,
              VAR3: `${shortLink}`,
            }
          );
          
        } else{
          await axios.post(
            `https://2factor.in/API/V1/${process.env.TWO_FACTOR_KEY}/ADDON_SERVICES/SEND/TSMS`,
            {
              From: 'SHPOUT',
              To: mobileNumber,
              TemplateName: 'coshopinvite',
              VAR1: `${name || ""}`,
              VAR2: `${shortLink || ""}`,
            }
          );
        }
      } catch (error) {
      console.error(error, ' <==== Error while sending text msg');
    }
    try {
      // client.messages
      //   .create({
      //     from: `whatsapp:${process.env.TWILIO_WA_FROM_NUMBER}`,
      //     body,
      //     to: `whatsapp:+91${mobileNumber}`,
      //   })
      //   .then((message) => console.log(message.sid));
    } catch (error) {
      console.error(error, ' <==== Error while sending whatsapp notification');
    }
    try {
      if (firebaseToken) {
        dispatchSingleNotification(firebaseToken, title, notificationBody, {
          appointmentId,
          mobileNumber,
          inviteFrom,
        });
        dispatchSingleNotificationApple(
          firebaseToken,
          title,
          notificationBody,
          { appointmentId, mobileNumber, inviteFrom }
        );
      }
    } catch (error) {
      console.error(error, ' <=== Error while sending app notification');
    }

    const alreadyInvite = await Invites.findOne({
      invite_to: inviteFrom,
      invite_data: {
        appointment_id: appointmentId,
        mobile_number: mobileNumber,
      },
    }).sort({
      _id: -1,
    });

    
    if (alreadyInvite) {
      const currentDate = moment();
      const appointmentDate = moment(alreadyInvite.invite_time);
      const diff = currentDate.diff(appointmentDate, 'minutes');
      let invitation = await Invites.findByIdAndUpdate(alreadyInvite._id, {invite_time: new Date()})
      invitation = (await invitation).toJSON();
      return res
          .status(200)
          .json({ message: 'Active invite already exists', invitation });
    }
    let createdInvite = Invites.create({
      link: shortLink,
      invite_time: new Date(),
      invite_data: {
        appointment_id: appointmentId,
        mobile_number: mobileNumber,
      },
      invite_to: inviteFrom,
    });

    createdInvite = (await createdInvite).toJSON();

    return res.json(createdInvite);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
});

router.post('/verifyAppointment', async (req, res) => {
  try {
    const { appointmentId, mobileNumber, inviteFrom } = req.body;
    const currentDate = moment();

    if (!appointmentId) {
      return res.status(500).json({ message: 'Invalid request' });
    }

    const appointmentData = await Invites.findOne({
      invite_to: inviteFrom,
      invite_data: {
        appointment_id: appointmentId,
        mobile_number: mobileNumber,
      },
    }).exec();

    if (!appointmentData) {
      return res.status(404).json({ message: 'No appointment found' });
    }

    const appointmentDate = moment(appointmentData.invite_time);

    const diff = currentDate.diff(appointmentDate, 'minutes');

    if (diff >= parseInt(process.env.EXPIRY_MINUTES, 10)) {
      return res.status(500).json({ message: 'The appointment is expired' });
    }

    return res.status(200).json({ message: 'Success', appointmentData });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
});

router.get('/:appointmentId', async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const appointmentInvites = await Invites.find(
      {
        'invite_data.appointment_id': appointmentId,
      },
      {},
      {
        lean: true,
      }
    );
    return res.status(200).json({
      message: 'Appoinment invites list fetch successfully',
      data: { appointmentInvites },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
});

module.exports = router;
