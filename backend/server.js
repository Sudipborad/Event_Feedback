import dotenv from 'dotenv';
import { buildApp } from './src/app.js';

// Initialize environment configuration
dotenv.config();

const app = buildApp();

const PORT = parseInt(process.env.PORT || '5000', 10);
const HOST = process.env.HOST || '127.0.0.1';

/**
 * Start Fastify Server
 */
const start = async () => {
  try {
    await app.listen({ port: PORT, host: HOST });
    app.log.info(`Server listening on http://${HOST}:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
