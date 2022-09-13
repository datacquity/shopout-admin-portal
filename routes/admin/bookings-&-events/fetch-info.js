const router = require("express").Router();

const Category = require("../../../models/classifiers/category-schema.js");

const Booking = require("../../../models/operations/booking-schema");

const DemoBooking = require("../../../models/operations/demo-booking-schema");

const Store = require("../../../models/entities/store-schema");

const Business = require("../../../models/entities/business-schema");

router.get("/get", async (req, res) => {
	// res.json({success : "Hello"});
	try {
		var stores = [];
		const demobookings = await DemoBooking.find(
			{},
			async (err, foundDemoBooking) => {},
		);
		// .populate({ path: "business", select: "name" });

		const bookings = await Booking.find(
			{},
			async (err, foundBooking) => {},
		).populate({
			path: "store",
			select: "business",
			populate: { path: "business", select: "name , display_name" },
		});

		res.json({
			success: "true",
			demoBookings: demobookings,
			bookings: bookings,
		});
	} catch (e) {
		console.log(e);
	}
});

module.exports = router;
