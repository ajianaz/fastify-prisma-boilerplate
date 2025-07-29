const postController = require('../controllers/postController')

async function postRoutes(fastify, options) {
  fastify.get('/posts', postController.getAllPosts)
  fastify.get('/posts/:id', postController.getPostById)
  fastify.get('/posts/published', postController.getPublishedPosts)

  fastify.post(
    '/posts',
    {
      schema: {
        body: {
          type: 'object',
          required: ['title', 'authorId'],
          properties: {
            title: { type: 'string' },
            content: { type: 'string' },
            published: { type: 'boolean' },
            authorId: { type: 'integer' }
          }
        }
      }
    },
    postController.createPost
  )

  fastify.put(
    '/posts/:id',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            content: { type: 'string' },
            published: { type: 'boolean' }
          }
        }
      }
    },
    postController.updatePost
  )

  fastify.delete('/posts/:id', postController.deletePost)
}

module.exports = postRoutes
