import Fastify from 'fastify';
import cors from '@fastify/cors';
import welcomeRoutes from './routes/welcome.js';
import feedbackRoutes from './routes/feedback.js';

/**
 * Build Fastify App instance
 * Registers middleware (CORS) and API routes.
 */
export function buildApp() {
  const fastify = Fastify({
    logger: true
  });

  // Enable CORS configuration
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  fastify.register(cors, {
    origin: frontendUrl,
    methods: ['GET', 'POST', 'OPTIONS'],
  });

  // Register Route Modules under '/api' prefix
  fastify.register(welcomeRoutes, { prefix: '/api' });
  fastify.register(feedbackRoutes, { prefix: '/api' });

  return fastify;
}
