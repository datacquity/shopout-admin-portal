require('dotenv').config();
const mongoose = require('mongoose');

const { Schema } = mongoose;
// global date format - YYYY-MM-DDTHH:MM:SS
// seconds can be omitted

const inviteSchema = new Schema(
  {
    link: Schema.Types.String,
    invite_time: Date,
    invite_data: {
      appointment_id: String,
      mobile_number: String,
    },
    invite_to: {
      type: String,
      default: '',
      enum: ['user', 'store'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('call-invites', inviteSchema);
// name, schema, collection
