import { createFeedback, updateFeedback, deleteFeedback, getEventFeedbacks, getMyFeedbacks } from '../controllers/feedbackController.js';
import { verifyJWT, verifyAdmin } from '../middlewares/auth.js';

/**
 * Feedback routes plugin
 */
export default async function feedbackRoutes(fastify, options) {
  // Public submission of feedback (optional auth handled in controller)
  fastify.post('/feedback', createFeedback);

  // Authenticated User reviews management (requires verifyJWT)
  fastify.put('/feedback/:id', { preHandler: [verifyJWT] }, updateFeedback);
  fastify.delete('/feedback/:id', { preHandler: [verifyJWT] }, deleteFeedback);
  fastify.get('/feedback/my', { preHandler: [verifyJWT] }, getMyFeedbacks);

  // Admin event-specific feedback inspections (requires Admin role)
  fastify.get('/events/:eventId/feedback', { preHandler: [verifyJWT, verifyAdmin] }, getEventFeedbacks);
}
