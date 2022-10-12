const router = require("express").Router();

// const Business = require("../../utils/csvtomongo/models/business-schema");

const Business = require("../../../models/entities/business-schema");

// Create Business

router.post("/business", async (req, res) => {
	try {
		let {
			tags,
			GSTIN,
			brands,
			name,
			phone,
			email,
			password,
			logo,
			description,
			images,
			title_image,
			category,
			display_name,
			hasCallNow,
			isFashion,
		} = req.body.businessData;
		tags = tags.toString().toLowerCase().split(",");
		brands = brands.toString().toLowerCase().split(",");
		category = category.toString();
		name = name.toLowerCase();

		if (description.split(" ").length > 100) {
			return res
				.status(404)
				.json({
					message: "Please enter description less than 100 characters!",
				});
		}

		let newBusiness = new Business({
			name: name,
			phone,
			email,
			password,
			logo,
			description,
			images,
			title_image,
			tags: [...tags, category],
			brands: brands,
			category: category,
			display_name,
			hasCallNow,
			isFashion,
			GSTIN
		});

		newBusiness.save((err, savedBusiness) => {
			if (err) {
				console.error(err);
			} else {
				let businessID = savedBusiness._id;
				console.log("Business ID:", businessID);

				// addCategory(category, businessID);
				// addTags(tags, businessID);
				// addBrands(brands, businessID);
			}
			res.json({
				success: "New business has created.",
				business: savedBusiness,
			});
		});
	} catch (e) {
		console.log(e);
		res.json({ error: e });
	}
});

//Upload Image for Business after creating business.

router.post("/business/images", async (req, res) => {
	const { businessNewImages } = req.body;

	const businessId = businessNewImages.businessId;

	const newImages = businessNewImages.newImages;

	console.log(businessId);

	// console.log(newImages);

	for (let i = 0; i < newImages.length; i++) {
		Business.findOneAndUpdate(
			{ _id: businessId },
			{ $push: { images: newImages } },
			(err, savedBusiness) => {
				if (err) console.error(err);
				else console.log("Saved a Image(s) for", savedBusiness.name);
			},
		);
	}
});

module.exports = router;
