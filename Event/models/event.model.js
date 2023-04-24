const { Schema, model } = require('mongoose');

/**
 *
 * @type {module:mongoose.Schema<any>}
 */

const speakerSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  occupation: { type: String, required: true },
  topic: { type: String, required: true },
  photo: { type: String, required: true },
  twitterURL: { type: String, required: true },
  linkedInURL: { type: String, required: true },
});

const attendeeSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  organization: { type: String, required: true },
});

const eventSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    headerImage: {
      type: String,
    },
    venue: {
      type: String,
    },
    startTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
    status: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    speakers: {
      type: [speakerSchema],
    },
    attendeeCount: {
      type: Number,
      default: 0,
    },
    attendees: {
      type: [attendeeSchema],
    },
    capacity: {
      type: Number,
    },
    tags: {
      type: [String],
    },
    joinLink: {
      type: String,
    },
    host: {
      type: String,
    },
    org: {
      type: String,
    },
    orgId: {
      type: Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

module.exports = model('Event', eventSchema);
