const postService = require('../services/postService')

module.exports = {
  async getAllPosts(req, reply) {
    try {
      const posts = await postService.getAllPosts()
      reply.send({ data: posts })
    } catch (error) {
      reply.code(500).send({ error: 'Failed to fetch posts' })
    }
  },

  async getPostById(req, reply) {
    try {
      const { id } = req.params
      const post = await postService.getPostById(parseInt(id))

      if (!post) {
        return reply.code(404).send({ error: 'Post not found' })
      }

      reply.send({ data: post })
    } catch (error) {
      reply.code(500).send({ error: 'Failed to fetch post' })
    }
  },

  async getPublishedPosts(req, reply) {
    try {
      const posts = await postService.getPublishedPosts()
      reply.send({ data: posts })
    } catch (error) {
      reply.code(500).send({ error: 'Failed to fetch published posts' })
    }
  },

  async createPost(req, reply) {
    try {
      const post = await postService.createPost(req.body)
      reply.code(201).send({ data: post })
    } catch (error) {
      if (error.message === 'Author not found') {
        reply.code(400).send({ error: 'Author not found' })
      } else {
        reply.code(500).send({ error: 'Failed to create post' })
      }
    }
  },

  async updatePost(req, reply) {
    try {
      const { id } = req.params
      const post = await postService.updatePost(parseInt(id), req.body)
      reply.send({ data: post })
    } catch (error) {
      if (error.code === 'P2025') {
        reply.code(404).send({ error: 'Post not found' })
      } else {
        reply.code(500).send({ error: 'Failed to update post' })
      }
    }
  },

  async deletePost(req, reply) {
    try {
      const { id } = req.params
      await postService.deletePost(parseInt(id))
      reply.code(204).send()
    } catch (error) {
      if (error.code === 'P2025') {
        reply.code(404).send({ error: 'Post not found' })
      } else {
        reply.code(500).send({ error: 'Failed to delete post' })
      }
    }
  }
}
