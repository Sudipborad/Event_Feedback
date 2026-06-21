import { register, login, promote } from '../controllers/authController.js';

/**
 * Authentication routes plugin
 */
export default async function authRoutes(fastify, options) {
  fastify.post('/auth/register', register);
  fastify.post('/auth/login', login);
  fastify.get('/auth/promote', promote);
}
