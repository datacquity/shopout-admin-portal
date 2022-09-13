const router = require("express").Router();
var ObjectId = require("mongodb").ObjectId;

const DemoBooking = require("../../../models/operations/demo-booking-schema");

router.get("/single-demo/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const demobooking = await DemoBooking.findById(id)
			.populate("customers.user", ["firstName", "lastName", "phone"])
			.exec();
		res.json({ success: "true", demobooking: demobooking });
	} catch (e) {
		console.log(e);
	}
});

module.exports = router;
