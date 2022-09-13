const router = require("express").Router();
var ObjectId = require("mongodb").ObjectId;

const DemoBooking = require("../../../models/operations/demo-booking-schema");

router.get("/all-demo-booking", async (req, res) => {
	try {
		const demoBookings = await DemoBooking.find({
			demoName: { $exists: true },
		}).select(
			"duration capacity store business demoName description demoDate startTime demoId customers",
		);

		res.json({ success: "true", demoBookings });
	} catch (e) {
		console.log(e);
	}
});

module.exports = router;
