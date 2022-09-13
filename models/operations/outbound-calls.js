require('dotenv').config();
const mongoose = require('mongoose');

const { Schema } = mongoose;
// global date format - YYYY-MM-DDTHH:MM:SS
// seconds can be omitted

const outboundCallsSchema = new Schema(
  {
    name:Schema.Types.String,
    mobile :Schema.Types.String,
    date:Schema.Types.String,
    time:Schema.Types.String,
    dateTime: Schema.Types.Date,
    store: Schema.Types.String,
    storeId: String,
    reason: String,
    userId: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('outbound-calls', outboundCallsSchema);
// name, schema, collection
