import fastify, { FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import sensible from '@fastify/sensible'
import userRoutes from './routes/userRoutes'
import postRoutes from './routes/postRoutes'

const app: FastifyInstance = fastify({
  logger: true
})

// Register CORS plugin
app.register(cors, {
  origin: '*' // Mengizinkan semua origin untuk development
})

// Register JSON schema validation
app.register(sensible)

// Register routes
app.register(userRoutes, { prefix: '/api' })
app.register(postRoutes, { prefix: '/api' })

// Health check endpoint
app.get('/health', async (request, reply) => {
  return { status: 'OK', timestamp: new Date().toISOString() }
})

// Root endpoint
app.get('/', async (request, reply) => {
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
    await app.listen({
      port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
      host: '0.0.0.0'
    })
    console.log(
      `Server berjalan di http://localhost:${process.env.PORT || 3000}`
    )
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
