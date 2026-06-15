import Feedback from '../models/Feedback.js';

/**
 * Feedback Route Handler
 * Interacts with MongoDB database using Mongoose model.
 */
export default async function feedbackRoutes(fastify, options) {
  // GET /api/feedback - Retrieve all feedbacks from MongoDB
  fastify.get('/feedback', async (request, reply) => {
    try {
      const list = await Feedback.find().sort({ createdAt: -1 });
      return list;
    } catch (err) {
      fastify.log.error(err);
      reply.status(500);
      return { error: 'Failed to retrieve feedback data' };
    }
  });

  // POST /api/feedback - Save feedback to MongoDB
  fastify.post('/feedback', async (request, reply) => {
    try {
      const { name, email, eventName, message } = request.body || {};
      
      const feedbackItem = new Feedback({
        name,
        email,
        eventName,
        message,
      });

      const savedFeedback = await feedbackItem.save();
      
      reply.status(201);
      return savedFeedback;
    } catch (err) {
      fastify.log.error(err);
      reply.status(500);
      return { error: 'Failed to save feedback data' };
    }
  });
}
