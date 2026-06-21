import { getEvents, getEventById, createEvent, updateEvent, deleteEvent } from '../controllers/eventController.js';
import { verifyJWT, verifyAdmin } from '../middlewares/auth.js';

/**
 * Event routes plugin
 */
export default async function eventRoutes(fastify, options) {
  fastify.get('/events', getEvents);
  fastify.get('/events/:id', getEventById);
  
  // Secure endpoints (require Admin role)
  fastify.post('/events', { preHandler: [verifyJWT, verifyAdmin] }, createEvent);
  fastify.put('/events/:id', { preHandler: [verifyJWT, verifyAdmin] }, updateEvent);
  fastify.delete('/events/:id', { preHandler: [verifyJWT, verifyAdmin] }, deleteEvent);
}
