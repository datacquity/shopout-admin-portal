const router = require("express").Router();
var ObjectId = require("mongodb").ObjectId;

const ArchiveDemoBooking = require("../../../models/operations/archive-demo-booking-schema");
const DemoBooking = require('../../../models/operations/demo-booking-schema');

router.get("/single-demo/:id", async (req, res) => {
	try {
		const { id } = req.params;
		console.log(id);
		const demobooking = await DemoBooking.findById(id)
			.populate("customers.user", ["firstName", "lastName", "phone"])
			.exec();
			console.log(demobooking)
		res.json({ success: "true", demobooking: demobooking });
	} catch (e) {
		console.log(e);
	}
});

router.get("/single-archive-demo/:id", async(req, res) => {
	try {
		const { id } = req.params;
		const demobooking = await ArchiveDemoBooking.findById(id)
			.populate("customers.user", ["firstName", "lastName", "phone"])
			.exec();
		res.json({ success: "true", demobooking: demobooking });
	} catch (e) {
		console.log(e);
	}
})
module.exports = router;
