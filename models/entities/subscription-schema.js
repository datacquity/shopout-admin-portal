const mongoose = require('mongoose');

const { Schema } = mongoose;

const subscriptionSchema = new Schema({
  business: {
    type: Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  store: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  expiryDate: {
    type: Schema.Types.Date,
    required: true
  },
  startDate: {
    type: Schema.Types.Date
  }
})

module.exports = mongoose.model('Subscriptions', subscriptionSchema, 'subscriptions');