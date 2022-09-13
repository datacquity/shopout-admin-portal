const mongoose = require('mongoose');
const { Schema } = mongoose;

const { customAlphabet } = require('nanoid')
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const nanoid = customAlphabet(alphabet, 7)

const reviewLiveEvent = new Schema({
  business: {
    type: Schema.Types.ObjectId,
    ref: 'Business'
  },
  store: {
    type: Schema.Types.ObjectId,
    ref: 'Store'
  },
  demoName: {
    type: String,
    required: true
  },
  demoDate: {
    type: Date,
    required: true
  },
  image: { type: String },
  demoDescription: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    default: 20
  },
  startTime: {
    type: Date,
    required: true
  },
  capacity: {
    type: Number,
    default: 30
  },
  tags: [
    {
      type: String
    }
  ],
  demoId: {
    type: String,
    default: () => nanoid()
  },
  productName: {
    type: String
  },
  productDescription: { type: String },
  quantity: {
    type: Number,
    default: 10
  },
  price: [{
    type: Number
  }],
  discount: {
    type: Number,
    default: 0,
  },
  deliveryCharge: {
    type: Number,
    required: true
  },
  variants: [{
    type: String
  }],
  cgst: {
    type: Number,
    required: true
  },
  sgst: {
    type: Number,
    required: true
  },
  remark: {
    type: String
  },
});

module.exports = mongoose.model('ReviewLiveEvent', reviewLiveEvent, 'reviewliveevents');
