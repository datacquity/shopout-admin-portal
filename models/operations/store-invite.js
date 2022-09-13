require('dotenv').config();
const mongoose = require('mongoose');
const mongooseHistory = require('mongoose-history-trace');

const { Schema } = mongoose;
// global date format - YYYY-MM-DDTHH:MM:SS
// seconds can be omitted

const inviteSchema = new Schema(
  {
    store: { type: Schema.Types.ObjectId, ref: 'Store' },
    date: { type: Date, required: true },
    invitee: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'ignore', 'accept', 'decline', 'joined'],
      },
    },
    reason_code: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Invitees', inviteSchema, 'invitee');
// name, schema, collection
