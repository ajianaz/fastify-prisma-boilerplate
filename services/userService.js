const prisma = require('../lib/prisma')

module.exports = {
  async getAllUsers() {
    return prisma.user.findMany({
      include: { posts: true }
    })
  },

  async getUserById(id) {
    return prisma.user.findUnique({
      where: { id },
      include: { posts: true }
    })
  },

  async createUser({ email, name }) {
    return prisma.user.create({
      data: { email, name }
    })
  },

  async updateUser(id, { email, name }) {
    return prisma.user.update({
      where: { id },
      data: {
        ...(email && { email }),
        ...(name && { name })
      }
    })
  },

  async deleteUser(id) {
    return prisma.user.delete({
      where: { id }
    })
  }
}
