const mongoose = require('mongoose');

const { Schema } = mongoose;

// global date format - YYYY-MM-DDTHH:MM:SS
// seconds can be omitted

const eventRecordingSchema = new Schema(
  {
    file: {
      type: Object,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    uid: {
      type: String,
      required: true,
    },
    eventId: {
      type: String,
      required: true,
    },
    businessId: {
      type: String,
      required: true,
    },
  },
  { strict: false }
);

eventRecordingSchema.index({ businessId: 1 });

module.exports = mongoose.model(
  'EventRecording',
  eventRecordingSchema,
  'EventRecording'
);
// name, schema, collection
