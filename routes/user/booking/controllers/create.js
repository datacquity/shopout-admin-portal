const router = require('express').Router();
const User = require('../../../../models/entities/user-schema');
const Store = require('../../../../models/entities/store-schema');
const Booking = require('../../../../models/operations/booking-schema');
const verifySession = require('../../auth/verifySession');
const fillSlots = require('./slots');
const saveNewNotification = require('../../../../utils/notification-constructor');
const { dispatchSingleNotification, dispatchSingleNotificationApple } = require('../../../../utils/notification-dispatcher');
const handleError = require('../../../../error_handling/handler');


const createAppointment = async (req, res, bookingData) => 
{

  if (!bookingData) {
    return res.status(400).json({
      error: 'Invalid request format.',
    });
  }

  // SAVE A NEW BOOKING IN THE TABLE
  const savedBooking = await Booking.create(bookingData);

  if (!savedBooking) {
    return res.status(400).json({
      error: 'Unable to save booking.',
    });
  }

  const user = await User.findOneAndUpdate(
    {
      phone: req.body.cred.phone,
    },
    {
      $push: {
        bookings: savedBooking,
      },
    }
  );

  // UPDATE STORE DATA WITH THE BOOKING
  const store = await Store.findOneAndUpdate(
    {
      _id: bookingData.store,
    },
    {
      $push: {
        bookings: savedBooking,
      },
    }
  ).populate('business');

  // IF NO ERROR, FILL THE SLOTS ( ALREADY APPROVED )
  fillSlots(bookingData);

  // SUCCESS RESPONSE SENT
  res.status(200).json({
    response: 'Booking created successfully',
    booking: savedBooking._id,
  });

  // NOTIFICATION GENERATION AND FIREBASE PUSH
  const businessDisplayName = store.business.display_name;
  const dateOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  const displayDate = new Date(savedBooking.start).toLocaleDateString(
    'en-US',
    dateOptions
  );

  let textUser;
  let textStoreNotification;

  if (bookingData.type === 'virtual') {
    textUser = `Your virtual booking for ${displayDate} with ${businessDisplayName} ${store.name} has been confirmed`;
    textStoreNotification = `You have received a booking for ${displayDate} from ${user.firstName} ${user.lastName}`;
  } else {
    textUser = `Your booking for ${displayDate} with ${businessDisplayName} ${store.name} has been confirmed`;
    textStoreNotification = `You have received a booking for ${displayDate} from ${user.firstName} ${user.lastName}`;
  }

  const titleUser = 'Booking Confirmed!';
  const titleStoreNotification = 'New Booking!';

  // Dispatch notification to user
  // dispatchSingleNotification(user.firebaseToken, titleUser, textUser, {
  //   booking: savedBooking._id.toString(),type: 'booking-60'
  // });
  // Dispatch notification to store
  // dispatchSingleNotification(
  //   store.firebaseToken,
  //   titleStoreNotification,
  //   textStoreNotification,
  //   {
  //     booking: savedBooking._id.toString(),type: 'booking-60'
  //   }
  // );
  // dispatchSingleNotificationApple(
  //   store.deviceToken,
  //   titleStoreNotification,
  //   textStoreNotification,
  //   {
  //     booking: savedBooking._id.toString(), type: 'booking-60'
  //   }
  // );
  // saveNewNotification(
  //   titleUser,
  //   textUser,
  //   store.business.logo,
  //   user._id,
  //   null,
  //   savedBooking._id
  // );
  // saveNewNotification(
  //   titleStoreNotification,
  //   textStoreNotification,
  //   store.business.logo,
  //   null,
  //   store._id,
  //   savedBooking._id
  // );
}

router.post('/', async (req, res) => {
  const { bookingData } = req.body;
  return await createAppointment(req, res, bookingData)
});

module.exports = {router, createAppointment};
