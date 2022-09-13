const router = require("express").Router();

const Category = require("../../../models/classifiers/category-schema.js");

router.get("/get", async (req, res) => {
	try {
		Category.find({}, (err, foundCategory) => {
			if (foundCategory) {
				res.json({ success: "true", categories: foundCategory });
			}
		});
	} catch (e) {
		console.log(e);
	}
});

module.exports = router;
