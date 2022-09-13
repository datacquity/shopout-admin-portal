const router = require('express').Router();
const handleError = require('../../../../../error_handling/handler');
const demoBooking = require('../../../../../models/operations/demo-booking-schema');
const archiveDemoBooking = require('../../../../../models/operations/archive-demo-booking-schema');
const User = require('../../../../../models/entities/user-schema');
const Store = require('../../../../../models/entities/store-schema');

const HOUR = 60 * 60 * 1000;

// fetch all demo bookings
router.post('/all', (req, res) => {
  try {
    const timeNow = new Date();
    demoBooking
      .find()
      .select(
        'demoName description demoDate startTime duration image channelName store capacity tags customers business'
      )
      .sort('startTime')
      .exec((err, demobookings) => {
        demobookings.forEach(async (demobooking) => {
          // eslint-disable-next-line max-len
          if (
            timeNow.getTime() >
            new Date(demobooking.startTime).getTime() +
              (demobooking.duration + 30) * 60 * 1000
          ) {
            let archivedemobooking = await archiveDemoBooking.findOne({
              demoId: demobooking._id,
            });
            if (!archivedemobooking) {
              const archiveDemoData = {
                demoId: demobooking._id,
                demoName: demobooking.demoName,
                demoDate: demobooking.demoDate,
                description: demobooking.description,
                startTime: demobooking.startTime,
                capacity: demobooking.capacity,
                tags: demobooking.tags,
                customers: demobooking.customers,
                store: demobooking.store,
                business: demobooking.business,
                image: demobooking.image,
                duration: demobooking.duraton,
              };
              archivedemobooking = await archiveDemoBooking.create(
                archiveDemoData
              );

              // delete event from demobookings
                await demoBooking.findOneAndDelete(
                  { _id: demobooking._id },
                  { multi: true }
                );

              // remove event from demobooking array and push to archivedemobooking array for users
              await demobooking.customers.forEach(async (customer) => {
                await User.findOneAndUpdate(
                  { _id: customer.user },
                  {
                    $push: {
                      archiveDemoBookings: archivedemobooking._id,
                    },
                    $pull: {
                      demoBookings: demobooking._id,
                    },
                  }
                );
              });

              // remove event from demobooking array and push to archivedemobooking array for store
              await Store.findOneAndUpdate(
                { _id: demobooking.store },
                {
                  $push: {
                    archiveDemoBookings: archivedemobooking._id,
                  },
                  $pull: {
                    demoBookings: demobooking._id,
                  },
                }
              );
            }
          }
        });
        if (err) {
          handleError(err);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.status(200).json({ demobookings });
        }
      });
  } catch (error) {
    handleError(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// fetch one demo booking
router.post('/single', async (req, res) => {
  try {
    const { bookingData, user } = req.body;
    const timeNow = new Date();

    const demoInformation = {
      liveNow: false,
      ended: false,
      userRegistered: false,
      capacityFull: false,
    };

    const demo = await demoBooking.findById(bookingData._id);
    // console.log(demo.demoName, demo.startTime);
    console.log(demo);
    if (!demo) {
      return res.status(400).json({ error: "Demo couldn't be found." });
    }

    if (demo) {
      const { customers } = demo;
      const now = timeNow.getTime();
      const startTime = new Date(demo.startTime).getTime();
      const endTime = startTime + (demo.duration / 60) * HOUR;

      if (now >= startTime && now < endTime) {
        demoInformation.liveNow = true;
      }

      if (now > endTime) {
        demoInformation.ended = true;
      }

      customers.forEach((customer) => {
        if (customer.user.toString() === user._id) {
          demoInformation.userRegistered = true;
        }
      });

      if (customers.length === demo.capacity) {
        demoInformation.capacityFull = true;
      }

      return res.status(200).json({ ...demoInformation, demo });
    }
  } catch (error) {
    handleError(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

router.post('/upload', async (req, res) => {
  try {
    const { demoData } = req.body;

    const demo = await demoBooking.create(demoData);
    if (!demo) {
      return res.status(400).json({
        error: 'Unable to save demo booking.',
      });
    }

    res.status(200).json({ data: demo , success : "Event is Created." });
  } catch (error) {
    console.log(error);
    handleError(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
