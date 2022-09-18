const Tags = require("../../../models/classifiers/tag-schema");
const express = require("express");

const router = express.Router();

const getTags = async (req, res) => {
	const tags = await Tags.find({});
	const tagNames = tags.map((tag) => {
		return tag.name;
	});
	res.json({ tags: tagNames });
};

router.get("/tags", getTags);

module.exports = router;
