// Temporary in-memory storage array for feedbacks
const feedbacks = [];

/**
 * Feedback Route Handler
 * Defines endpoints for submitting and listing feedbacks.
 */
export default async function feedbackRoutes(fastify, options) {
  // GET /api/feedback - Return all submitted feedback
  fastify.get('/feedback', async (request, reply) => {
    return feedbacks;
  });

  // POST /api/feedback - Store new feedback in memory
  fastify.post('/feedback', async (request, reply) => {
    const { name, email, eventName, message } = request.body || {};
    
    const newFeedback = {
      id: feedbacks.length + 1,
      name,
      email,
      eventName,
      message,
      createdAt: new Date().toISOString()
    };
    
    feedbacks.push(newFeedback);
    
    reply.status(201);
    return {
      success: true,
      message: 'Feedback submitted successfully',
      data: newFeedback
    };
  });
}
