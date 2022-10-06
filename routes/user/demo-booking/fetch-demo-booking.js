const router = require("express").Router();
var ObjectId = require("mongodb").ObjectId;

const ArchiveDemoBooking = require("../../../models/operations/archive-demo-booking-schema");
const DemoBooking = require("../../../models/operations/demo-booking-schema");

router.get("/all-demo-booking", async (req, res) => {
	try {
		const demoBookings = await DemoBooking.find({
			demoName: { $exists: true },
		}).select(
			"duration capacity store business demoName description demoDate startTime demoId customers",
		).populate({path: 'business', select: ['name', 'display_name']}).exec();

		res.json({ success: "true", demoBookings });
	} catch (e) {
		console.log(e);
	}
});
router.get("/all-archive-demo-booking", async (req, res) => {
	try {
		const demoBookings = await ArchiveDemoBooking.find({
			demoName: { $exists: true },
		}).select(
			"duration capacity store business demoName description demoDate startTime demoId customers",
		).populate({path: 'business', select: ['name', 'display_name']}).exec();

		res.json({ success: "true", demoBookings });
	} catch (e) {
		console.log(e);
	}
});

module.exports = router;
