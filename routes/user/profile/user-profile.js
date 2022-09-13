const router = require('express').Router();
const User = require('../../../models/entities/user-schema');
const handleError = require('../../../error_handling/handler');
const verifySession = require('../auth/verifySession');
const Order = require('../../../models/operations/order-schema');

// =====================================
// PROFILE ACTIONS - CRUD
// Read routes
router.post('/fetch', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) throw Error('Invalid Phone Number');
    const user = await User.findOne({ phone }).select(
      'phone firstName lastName'
    );
    res.status(200).json({ user });
  } catch (e) {
    handleError(e);
    res.status(500).json({ error: e });
  }
});

// try {

// } catch(error) {
//   handleError(error)
//   return res.status(500).json({error: 'Internal server error.'})
// }

router.post('/fetch/notifications', verifySession, async (req, res) => {
  try {
    const { cred } = req.body;

    if (!cred) {
      return res.status(400).json({ error: 'Invalid request format.' });
    }

    const user = await User.findOne({ phone: cred.phone })
      .select('notifications')
      .populate({
        path: 'notifications',
        populate: {
          path: 'store',
          select: 'name _id',
          populate: { path: 'business', select: 'title_image name' },
        },
        options: {
          limit: 15,
          sort: { generatedTime: -1 },
        },
      });

    if (!user) {
      return res.status(400).json({ error: 'User not found.' });
    }

    return res.status(200).json({ notifications: user.notifications });
  } catch (error) {
    handleError(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});


//Fetch Orders
router.post('/fetch/orders', verifySession, async (req, res) => {
  try {
    const { cred } = req.body;

    console.log('cred -> ', cred)

    if (!cred) {
      return res.status(400).json({ error: 'Invalid request format.' });
    }


    const user = await User.findOne({ phone: cred.phone })
      .select('orders')
      .populate({
        path: 'orders',
        populate: {
          path: 'product, invoice',
        },
        options: {
          limit: 15,
          sort: { date: -1 },
        },
      });

      const orders = await Order.find({user: user._id}).populate("invoice");

    if (!user) {
      return res.status(400).json({ error: 'User not found.' });
    }

    return res.status(200).json({ orders });
  } catch (error) {
    handleError(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});


// Update routes
router.post('/update', verifySession, async (req, res) => {
  try {
    const { cred } = req.body;
    const { userData } = req.body;

    if (!cred || !userData) {
      return res.status(400).json({
        error: 'Invalid request format.',
      });
    }

    const user = await User.findOneAndUpdate(
      {
        phone: cred.phone,
      },
      {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        avatar: userData.avatar,
      }
    );

    if (!user) {
      return res.status(400).json({
        error: 'User not found.',
      });
    }

    return res.status(200).json({
      response: 'User profile updated successfully',
    });
  } catch (error) {
    handleError(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});
// =====================================

module.exports = router;
