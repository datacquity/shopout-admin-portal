const mongoose = require("mongoose");
const { customAlphabet } = require("nanoid");

const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const nanoid = customAlphabet(alphabet, 7);
const { Schema } = mongoose;

const demoBookingSchema = new Schema({
	isFashion: {
		type: Boolean,
		required: true,
		default: false,
	},
	demoId: {
		type: String,
		default: () => nanoid(),
	},
	business: {
		type: Schema.Types.ObjectId,
		ref: "Business",
		// required: true
	},
	store: {
		type: Schema.Types.ObjectId,
		ref: "Store",
	},
	demoName: {
		type: String,
		required: true,
	},
	demoDate: {
		type: Date,
		required: true,
	},
	image: { type: String },
	description: {
		type: String,
		required: true,
	},
	duration: {
		type: Number,
		required: true,
		default: 20,
	},
	startTime: {
		type: Date,
		required: true,
	},
	capacity: {
		type: Number,
		// required: true,
		default: 30,
	},
	tags: [
		{
			type: String,
		},
	],
	customers: [
		{
			_id: false,
			user: {
				type: Schema.Types.ObjectId,
				ref: "User",
				required: true,
			},
			interested: {
				type: Boolean,
				// required: true,
				default: true,
			},
			status: {
				type: String,
				// required: true,
				default: "Upcoming",
				enum: ["Upcoming", "Missed", "Live", "Cancelled", "Completed"],
			},
			timestamp: {
				type: Date,
				// required: true
			},
		},
	],
	channelName: {
		type: String,
		default: () => nanoid(),
	},
});

module.exports = mongoose.model(
	"DemoBooking",
	demoBookingSchema,
	"demobookings",
);
// name, schema, collection
