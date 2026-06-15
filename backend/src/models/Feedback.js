import mongoose from 'mongoose';

/**
 * Feedback Mongoose Schema
 * Represents the structure of feedback items stored in MongoDB.
 */
const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  eventName: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compile and export model
const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;
