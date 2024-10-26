import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import mysql from 'mysql2/promise';

const fastify = Fastify({ logger: true });

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'community_platform',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool instead of single connection
const pool = mysql.createPool(dbConfig);

// Register plugins
await fastify.register(cors, {
  origin: true,
  credentials: true
});

await fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-secret-key'
});

// Make db pool available in routes
fastify.decorate('mysql', pool);

// Authentication hook
fastify.addHook('onRequest', async (request, reply) => {
  try {
    if (request.routerPath?.startsWith('/api/auth')) return;
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

// Routes
fastify.register(import('./routes/auth.js'));
fastify.register(import('./routes/groups.js'));
fastify.register(import('./routes/users.js'));
fastify.register(import('./routes/courses.js'));

// Health check route
fastify.get('/health', async () => {
  return { status: 'ok' };
});

// Start server
try {
  await fastify.listen({ port: 3000, host: '0.0.0.0' });
  console.log('Server running at http://localhost:3000');
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  await fastify.close();
  await pool.end();
  process.exit(0);
});