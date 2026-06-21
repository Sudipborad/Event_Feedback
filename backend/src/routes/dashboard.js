import { getAdminDashboardData } from '../controllers/dashboardController.js';
import { verifyJWT, verifyAdmin } from '../middlewares/auth.js';

/**
 * Dashboard routes plugin
 */
export default async function dashboardRoutes(fastify, options) {
  // Admin dashboard metrics (requires Admin role)
  fastify.get('/admin/dashboard', { preHandler: [verifyJWT, verifyAdmin] }, getAdminDashboardData);
}
