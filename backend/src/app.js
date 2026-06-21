import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import feedbackRoutes from './routes/feedback.js';
import dashboardRoutes from './routes/dashboard.js';

/**
 * Build Fastify App instance
 * Registers plugins (JWT, CORS) and API routes under '/api' prefix.
 */
export function buildApp() {
  const fastify = Fastify({
    logger: true
  });

  // Register JWT Support
  const jwtSecret = process.env.JWT_SECRET || 'event-feedback-management-secret-key-2026';
  fastify.register(fastifyJwt, {
    secret: jwtSecret,
  });

  // Enable CORS configuration (Allow Authorization Headers)
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  fastify.register(cors, {
    origin: (origin, cb) => {
      // Allow localhost/127.0.0.1 on any port or configured client URL
      if (
        !origin || 
        origin === frontendUrl || 
        /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
      ) {
        cb(null, true);
        return;
      }
      cb(new Error('Not allowed by CORS'), false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Register Route Modules under '/api' prefix
  fastify.register(authRoutes, { prefix: '/api' });
  fastify.register(eventRoutes, { prefix: '/api' });
  fastify.register(feedbackRoutes, { prefix: '/api' });
  fastify.register(dashboardRoutes, { prefix: '/api' });

  return fastify;
}
