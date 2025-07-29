const prisma = require('../lib/prisma')

module.exports = {
  async getAllPosts() {
    return prisma.post.findMany({
      include: {
        author: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  },

  async getPostById(id) {
    return prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        }
      }
    })
  },

  async getPublishedPosts() {
    return prisma.post.findMany({
      where: { published: true },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  },

  async createPost({ title, content, published = false, authorId }) {
    const author = await prisma.user.findUnique({
      where: { id: authorId }
    })

    if (!author) throw new Error('Author not found')

    return prisma.post.create({
      data: { title, content, published, authorId },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        }
      }
    })
  },

  async updatePost(id, { title, content, published }) {
    return prisma.post.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content !== undefined && { content }),
        ...(published !== undefined && { published })
      },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        }
      }
    })
  },

  async deletePost(id) {
    return prisma.post.delete({ where: { id } })
  }
}
