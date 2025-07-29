const fastify = require('fastify')({
  logger: true
})

// Register CORS plugin
fastify.register(require('@fastify/cors'), {
  origin: '*' // Mengizinkan semua origin untuk development
})

// Register JSON schema validation
fastify.register(require('@fastify/sensible'))

// Register routes
fastify.register(require('./routes/userRoutes'), { prefix: '/api' })
fastify.register(require('./routes/postRoutes'), { prefix: '/api' })

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return { status: 'OK', timestamp: new Date().toISOString() }
})

// Root endpoint
fastify.get('/', async (request, reply) => {
  return {
    message: 'Fastify + Prisma + PostgreSQL API Boilerplate',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      posts: '/api/posts',
      health: '/health'
    }
  }
})

// Start server
const start = async () => {
  try {
    await fastify.listen({
      port: process.env.PORT || 3000,
      host: '0.0.0.0'
    })
    console.log(
      `Server berjalan di http://localhost:${process.env.PORT || 3000}`
    )
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
