import prisma from '../lib/prisma'
import { Post, PostCreateInput, PostUpdateInput } from '../types/prisma'
import { User } from '@prisma/client'

interface PostWithAuthor extends Post {
  author: {
    id: number
    name: string | null
    email: string
  }
}

export const getAllPosts = async (): Promise<PostWithAuthor[]> => {
  return prisma.post.findMany({
    include: {
      author: {
        select: { id: true, name: true, email: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  }) as Promise<PostWithAuthor[]>
}

export const getPostById = async (id: number): Promise<PostWithAuthor | null> => {
  return prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: { id: true, name: true, email: true }
      }
    }
  }) as Promise<PostWithAuthor | null>
}

export const getPublishedPosts = async (): Promise<PostWithAuthor[]> => {
  return prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: { id: true, name: true, email: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  }) as Promise<PostWithAuthor[]>
}

export const createPost = async (data: PostCreateInput & { published?: boolean }): Promise<PostWithAuthor> => {
  const { title, content, published = false, authorId } = data

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
  }) as Promise<PostWithAuthor>
}

export const updatePost = async (id: number, data: PostUpdateInput & { published?: boolean }): Promise<PostWithAuthor> => {
  const { title, content, published } = data

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
  }) as Promise<PostWithAuthor>
}

export const deletePost = async (id: number): Promise<Post> => {
  return prisma.post.delete({ where: { id } })
}
