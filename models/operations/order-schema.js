const mongoose = require("mongoose");

const { Schema } = mongoose;
// global date format - YYYY-MM-DDTHH:MM:SS
// seconds can be omitted

const orderSchema = new Schema({
	product: [
		{
			product: {
				type: Schema.Types.ObjectId,
				ref: "Products",
				required: true,
			},
			quantity: {
				type: Number,
				required: true,
			},
		},
	],
	orderId: { type: String },
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	invoice: {
		type: Schema.Types.ObjectId,
		ref: "Invoices",
	},
	paymentId: {
		type: String,
		default: null,
	},
	date: {
		type: Date,
		required: true,
	},
	status: {
		type: String,
		default: "pending",
		enum: ["pending", "paid"],
	},
	// quantity: {
	//     type: Number,
	//     required: true
	// },
	address: {
		type: String,
		required: true,
	},
	variant: {
		type: String,
	},
	email: {
		type: String,
	},
	amount: {
		type: Number,
		required: true,
	},
});

module.exports = mongoose.model("Orders", orderSchema, "orders");
// name, schema, collection
