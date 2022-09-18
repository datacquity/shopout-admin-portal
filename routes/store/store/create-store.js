const router = require("express").Router();

// const Store = require('../../../models/entities/store-schema');

const Store = require("../../../models/entities/store-schema");

// Business = require("./models/business-schema")

const Business = require("../../../models/entities/business-schema");

const bcrypt = require("bcrypt");

router.post("/store", async (req, res) => {
	try {
		const { storeData } = req.body;

		bcrypt.hash("shopout@123", 12).then((hashedPassword) => {
			let business = storeData.business.toLowerCase();
			let working_days;
			if (storeData.working_days.length == 6) {
				working_days = [1, 2, 3, 4, 5, 6];
			} else {
				working_days = [1, 2, 3, 4, 5, 6, 7];
			}

			Business.findOne({ name: business }, (err, foundBusiness) => {
				if (err) console.error(err);
				else if (foundBusiness) {
					let newStore = new Store({
						name: storeData.name,
						business: foundBusiness._id,
						tags: foundBusiness.tags,
						description: foundBusiness.description,
						category: foundBusiness.category,
						images: [],
						avg_rating: 4,
						phone: storeData.phone,
						password: hashedPassword,
						email: storeData.email,
						physical_enabled: storeData.physical_enabled,
						virtual_enabled: storeData.virtual_enabled,
						capacity: storeData.capacity,
						working_days: working_days,
						parameters: [
							{
								title: "Mandatory Masks",
								rating: 0,
								numberOfRatings: 0,
							},
							{
								title: "Social Distancing",
								rating: 0,
								numberOfRatings: 0,
							},
							{
								title: "Shop Sanitization",
								rating: 0,
								numberOfRatings: 0,
							},
							{
								title: "Temperature Checks",
								rating: 0,
								numberOfRatings: 0,
							},
							{
								title: "ePayment Options",
								rating: 0,
								numberOfRatings: 0,
							},
						],
						location_desc: storeData.location_desc,
						location: {
							type: "Point",
							coordinates: [storeData.long, storeData.lat],
						},
						city: storeData.city,
						active_hours: [
							{
								start: storeData.start,
								end: storeData.end,
							},
						],
						slots: {
							startTime: storeData.startTime,
						},
						video_slots: {
							startTime: storeData.startTime,
						},
					});
					console.log(newStore);
					newStore.save((err, savedStore) => {
						if (err) {
							console.error("Error before finding store", err);
						} else {
							Business.findOneAndUpdate(
								{ name: business },
								{ $push: { stores: savedStore._id } },
								(err, savedBusiness) => {
									if (err) console.error(err);
									else console.log("Saved a Store for", savedBusiness.name);
								},
							);
						}
						res.json({ success: "New store has created.", store: savedStore });
						// res.status(200);
					});
				}
			}); //end of business save
		});
		// res.send(savedStore);
		// res.status(200).json({newStore});
		// res.status(200);
	} catch (e) {
		res.json("error");
	}
});

module.exports = router;
