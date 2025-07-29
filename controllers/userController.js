const userService = require('../services/userService')

module.exports = {
  async getAllUsers(req, reply) {
    try {
      const users = await userService.getAllUsers()
      reply.send({ data: users })
    } catch (error) {
      reply.code(500).send({ error: 'Failed to fetch users' })
    }
  },

  async getUserById(req, reply) {
    try {
      const { id } = req.params
      const user = await userService.getUserById(parseInt(id))

      if (!user) {
        return reply.code(404).send({ error: 'User not found' })
      }

      reply.send({ data: user })
    } catch (error) {
      reply.code(500).send({ error: 'Failed to fetch user' })
    }
  },

  async createUser(req, reply) {
    try {
      const { email, name } = req.body
      const user = await userService.createUser({ email, name })
      reply.code(201).send({ data: user })
    } catch (error) {
      if (error.code === 'P2002') {
        reply.code(400).send({ error: 'Email already exists' })
      } else {
        reply.code(500).send({ error: 'Failed to create user' })
      }
    }
  },

  async updateUser(req, reply) {
    try {
      const { id } = req.params
      const { email, name } = req.body
      const updatedUser = await userService.updateUser(parseInt(id), {
        email,
        name
      })

      reply.send({ data: updatedUser })
    } catch (error) {
      if (error.code === 'P2025') {
        reply.code(404).send({ error: 'User not found' })
      } else if (error.code === 'P2002') {
        reply.code(400).send({ error: 'Email already exists' })
      } else {
        reply.code(500).send({ error: 'Failed to update user' })
      }
    }
  },

  async deleteUser(req, reply) {
    try {
      const { id } = req.params
      await userService.deleteUser(parseInt(id))
      reply.code(204).send()
    } catch (error) {
      if (error.code === 'P2025') {
        reply.code(404).send({ error: 'User not found' })
      } else {
        reply.code(500).send({ error: 'Failed to delete user' })
      }
    }
  }
}
