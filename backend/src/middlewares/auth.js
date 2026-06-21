/**
 * Authentication Middleware (verifyJWT)
 * Verifies JWT signature and binds request.user payload.
 */
export async function verifyJWT(request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: 'Unauthorized: Invalid or missing token' });
  }
}

// Alias for backward compatibility
export const authenticate = verifyJWT;

/**
 * Authorization Middleware (verifyAdmin)
 * Enforces admin role for protected administrative actions.
 */
export async function verifyAdmin(request, reply) {
  if (!request.user || request.user.role !== 'admin') {
    reply.status(403).send({ error: 'Forbidden: Admin access required' });
  }
}

