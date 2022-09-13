const mongoose = require('mongoose');

const { Schema } = mongoose;

const reviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  agent: { type: Schema.Types.ObjectId, ref: 'Agent' },
  userFeedback: {
    CallExperience: { type: String },
    Quality: { type: Number },
    ShoppingExperience: { type: String },
  },
});

module.exports = mongoose.model(
  'AgentFeedback',
  reviewSchema,
  'agent-feedback'
);
