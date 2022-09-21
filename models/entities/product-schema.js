const mongoose = require("mongoose");

const { Schema } = mongoose;
// global date format - YYYY-MM-DDTHH:MM:SS
// seconds can be omitted

const productSchema = new Schema({
	name: {
		type: String,
	},
	event: {
		type: Schema.Types.ObjectId,
		ref: "DemoBooking",
	},
	image: { type: String },
	desc: { type: String },
	quantity: {
		type: Number,
		default: 10,
	},
	isFashion: {
		type: Boolean,
		required: true,
		default: false,
	},
	price: [
		{
			type: Number,
		},
	],
	discount: [
		{
			type: Number,
		},
	],
	deliveryCharge: [
		{
			type: Number,
			required: true,
		},
	],
	variants: [
		{
			type: String,
		},
	],
	cgst: {
		type: Number,
		required: true,
	},
	sgst: {
		type: Number,
		required: true,
	},
	remark: {
		type: String,
	},
});

module.exports = mongoose.model("Products", productSchema, "products");
// name, schema, collection
