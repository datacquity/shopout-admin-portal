const router = require('express').Router();
const User = require('../../../../models/entities/user-schema');
const vFeedback = require('../../../../models/operations/virtual-feedback');
const Product = require('../../../../models/entities/product-schema');
const demoBooking = require('../../../../models/operations/demo-booking-schema');
const handleError = require('../../../../error_handling/handler');

router.post('/', async (req, res) => {

    try {

        const {
            user,
            event
        } = req.body;

        const Event = await demoBooking.findById({ _id: event });
        const prod = await Product.findOne({ event: event }).select('price discount sgst cgst');

        const customer = {
            user: user,
            interested: false,
            status: true
        }
        let f = 0;
        Event.customers.every(element => {
            if (element.user == customer.user) {
                element.status = true;
                f = 1;
                return false;
            }
            return true;
        });
        if (f == 0)
            Event.customers.push(customer);

        await demoBooking.findByIdAndUpdate({ _id: event }, { customers: Event.customers });
        const actualPrice = Math.round(prod.price[0] + (prod.price[0] * 0.01 * prod.sgst * 2));
        const discountedPrice = actualPrice - Math.round((actualPrice * 0.01 * prod.discount[0]));

        const feedbackGiven = await vFeedback.findOne({demobooking: event, user: user}) === null ? false : true;

        res.status(200).json({ price: actualPrice, discounted: Math.round(discountedPrice / 10) * 10, title: Event.demoName, feedback: feedbackGiven });
    } catch (error) {
        handleError(error);
        return res.status(500).json({ error: 'Internal server error.' });
    }


});

module.exports = router;
