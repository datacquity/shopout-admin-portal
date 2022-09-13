const mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const genID = customAlphabet(alphabet, 10);
const genChannel = customAlphabet(alphabet, 7);

const AgentSchema = new Schema({
  // credentials
  business: {
    type: Schema.Types.ObjectId,
    ref: 'Business'
    // required: true
  },
  loginID: {
    type: String,
    required: true,
    unique: true,
    dropDups: false,
    default: () => genID(),
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String.prototype,
    required: true,
  },
  channel: {
    type: String,
    required: true,
    default: () => genChannel(),
  },
  inactive_hours: [
    {
      start: String,
      end: String,
    },
  ],
  notifications: [{ type: ObjectId, ref: 'Notification' }],
  notificationHistory: [{ type: ObjectId, ref: 'Notification' }],
  _signingKey: { type: Buffer },
  firebaseToken: { type: String },
  deviceToken: { type: String },
});

// Create geoSpatial Indexing
// AgentSchema.index({ location: '2dsphere' });

const Agent = mongoose.model('Agent', AgentSchema, 'agents');

module.exports = Agent;
