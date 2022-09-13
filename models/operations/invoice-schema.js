require('dotenv').config();
const mongoose = require('mongoose');
const mongooseHistory = require('mongoose-history-trace');

const { Schema } = mongoose;
// global date format - YYYY-MM-DDTHH:MM:SS
// seconds can be omitted

const invoiceSchema = new Schema(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: 'booking',
    },
    date: {
      type: Date,
      required: true,
    },
    note: {
      type: String,
    },
    details: [
      {
        product: { type: String, required: true },
        code: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        cgst: { type: Number, required: true },
        sgst: { type: Number, required: true },
        discount: { type: Number, required: true },
      },
    ],
    delivery_price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    amount: {
      type: Number,
      required: true,
    },
    user: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'reject', 'accept', 'discard'],
    },
  },
  {
    timestamps: true,
  }
);

// Keep history
const options = {
  isAuthenticated: false,
  connectionUri: process.env.DB_TEMP,
};
invoiceSchema.plugin(mongooseHistory, options);

module.exports = mongoose.model('Invoices', invoiceSchema, 'invoice');
// name, schema, collection
