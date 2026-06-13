/**
 * Welcome Route Handler
 * Defines endpoints for welcome responses.
 */
export default async function welcomeRoutes(fastify, options) {
  fastify.get('/welcome', async (request, reply) => {
    return { message: 'Welcome to Event Feedback Management System' };
  });
}
