const mongoose = require("mongoose");
const mongoosastic = require("mongoosastic");

const { Schema } = mongoose;

const businessSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		dropDups: false,
	},
	phone: {
		type: Number,
		required: true,
	},
	email: {
		type: String,
	},
	password: {
		type: String,
		required: true,
	},
	logo: {
		type: String,
	},
	display_name: {
		type: String,
	},
	description: {
		type: String,
	},
	title_image: String,
	images: [],
	category: String,
	oldCategory: String,
	isFashion: {
		type: Boolean,
		required: true,
		default: false,
	},
	tags: [
		{
			type: String,
		},
	],
	brands: [
		{
			type: String,
		},
	],
	stores: [
		{
			type: Schema.Types.ObjectId,
			ref: "Store",
		},
	],
	agents: [
		{
			type: Schema.Types.ObjectId,
			ref: "Agent",
		},
	],
	agent_working_days: [Number],
	agent_active_hours: [
		{
			start: String,
			end: String,
		},
	],
	agentsSubscribed: {
		type: Boolean,
		required: true,
		default: false,
	},
	hasCallNow: {
		type: Boolean,
		default: false,
	},
	GSTIN: {
		type: String,
		required: true
	},
	commission:{
		type: Number,
		default: 0,
		max: 99	
	},
	businessUrl: {
		type: String,	
	}
});

businessSchema.index({ tags: 1 });
businessSchema.index({ brands: 1 });
businessSchema.index("category");
businessSchema.plugin(mongoosastic);

const Business = mongoose.model("Business", businessSchema, "businesses");

// const stream = Business.synchronize();
// let count = 0;

// stream.on('data', (err, doc) => {
//   if (err) {
//     return console.log(err);
//   }
//   count++;
// });
// stream.on('close', () => {
//   console.log(`indexed ${count} business documents!`);
// });
// stream.on('error', (err) => {
//   console.log(err);
// });

module.exports = Business;
