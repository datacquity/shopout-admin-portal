const router = require("express").Router();

const Product = require("../../../models/entities/product-schema");

const DemoBooking = require("../../../models/operations/demo-booking-schema");

// creating product for demo-booking event
router.post("/create", async (req, res) => {
	try {
		const { productData } = req.body;

		// let demobooking = productData.name;

		DemoBooking.findOne({ _id: productData.event }, (err, foundBooking) => {
			// console.log("data:", foundBooking);
			const {
				name, 
				description,
				image,
				quantity,
				price,
				discount,
				deliveryCharge,
				variants,
				cgst,
				sgst,
				remark,
				isFashion,
			} = productData;

			if (err) console.error(err);
			else if (foundBooking) {
				const { _id } = foundBooking;
				let newProduct = new Product({
					name,
					event: _id,
					desc: description,
					image,
					quantity,
					price,
					isFashion,
					discount,
					deliveryCharge,
					variants,
					cgst,
					sgst,
					remark,
				});
				if (newProduct.variants.length !== newProduct.price.length) {
					res.status(400).json({
						"error": "Please add data properly",
					});
				} else if (
					newProduct.price.length !== newProduct.deliveryCharge.length
				) {
					res.status(400).json({
						"error": "Please add data properly",
					});
				} else {
					newProduct.save((err, savedProduct) => {
						if (err) {
							console.error("Error before Saving Product", err);
						}
						res.json({
							success: "New Product is created for demo-booking.",
							product: savedProduct,
						});
					});
				}
			}
		});
	} catch (e) {
		console.log("Error !!", e);
	}
});

module.exports = router;
