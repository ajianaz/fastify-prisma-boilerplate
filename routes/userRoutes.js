const userController = require('../controllers/userController')

async function userRoutes(fastify, options) {
  fastify.get('/users', userController.getAllUsers)
  fastify.get('/users/:id', userController.getUserById)

  fastify.post(
    '/users',
    {
      schema: {
        body: {
          type: 'object',
          required: ['email'],
          properties: {
            email: { type: 'string', format: 'email' },
            name: { type: 'string' }
          }
        }
      }
    },
    userController.createUser
  )

  fastify.put(
    '/users/:id',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
            name: { type: 'string' }
          }
        }
      }
    },
    userController.updateUser
  )

  fastify.delete('/users/:id', userController.deleteUser)
}

module.exports = userRoutes
