const router = require("express").Router();
const Store = require("../../../models/entities/store-schema");
const Business = require("../../../models/entities/business-schema");

const bcrypt = require("bcrypt");

router.post("/store", async (req, res) => {
	try {
		let {
			business,
			working_days,
			name,
			phone,
			email,
			physical_enabled,
			virtual_enabled,
			capacity,
			location_desc,
			lat,
			long,
			city,
			start,
			end,
			startTime,
			isFashion,
		} = req.body.storeData;

		bcrypt.hash("shopout@123", 12).then((hashedPassword) => {
			business = business.toLowerCase();
			if (working_days.length === 6) {
				working_days = [1, 2, 3, 4, 5, 6];
			} else {
				working_days = [1, 2, 3, 4, 5, 6, 7];
			}

			Business.findOne({ name: business }, (err, foundBusiness) => {
				if (err) console.error(err);
				else if (foundBusiness) {
					const { _id, tags, description, category } = foundBusiness;

					let newStore = new Store({
						name,
						business: _id,
						tags,
						description,
						category,
						images: [],
						avg_rating: 4,
						phone,
						password: hashedPassword,
						email,
						physical_enabled,
						virtual_enabled,
						capacity,
						working_days,
						isFashion,
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
						location_desc,
						location: {
							type: "Point",
							coordinates: [long, lat],
						},
						city,
						active_hours: [
							{
								start,
								end,
							},
						],
						slots: {
							startTime,
						},
						video_slots: {
							startTime,
						},
					});

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
	} catch (e) {
		res.json("error");
	}
});

module.exports = router;
