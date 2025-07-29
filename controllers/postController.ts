import { FastifyRequest, FastifyReply } from 'fastify'
import * as postService from '../services/postService'
import { Post } from '@prisma/client'

interface PostParams {
  id: string
}

interface PostBody {
  title: string
  content?: string
  published?: boolean
  authorId: number
}

export const getAllPosts = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const posts = await postService.getAllPosts()
    reply.send({ data: posts })
  } catch (error) {
    reply.code(500).send({ error: 'Failed to fetch posts' })
  }
}

export const getPostById = async (req: FastifyRequest<{ Params: PostParams }>, reply: FastifyReply) => {
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
}

export const getPublishedPosts = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const posts = await postService.getPublishedPosts()
    reply.send({ data: posts })
  } catch (error) {
    reply.code(500).send({ error: 'Failed to fetch published posts' })
  }
}

export const createPost = async (req: FastifyRequest<{ Body: PostBody }>, reply: FastifyReply) => {
  try {
    const post = await postService.createPost(req.body)
    reply.code(201).send({ data: post })
  } catch (error: any) {
    if (error.message === 'Author not found') {
      reply.code(400).send({ error: 'Author not found' })
    } else {
      reply.code(500).send({ error: 'Failed to create post' })
    }
  }
}

export const updatePost = async (req: FastifyRequest<{ Params: PostParams, Body: Partial<PostBody> }>, reply: FastifyReply) => {
  try {
    const { id } = req.params
    const post = await postService.updatePost(parseInt(id), req.body)
    reply.send({ data: post })
  } catch (error: any) {
    if (error.code === 'P2025') {
      reply.code(404).send({ error: 'Post not found' })
    } else {
      reply.code(500).send({ error: 'Failed to update post' })
    }
  }
}

export const deletePost = async (req: FastifyRequest<{ Params: PostParams }>, reply: FastifyReply) => {
  try {
    const { id } = req.params
    await postService.deletePost(parseInt(id))
    reply.code(204).send()
  } catch (error: any) {
    if (error.code === 'P2025') {
      reply.code(404).send({ error: 'Post not found' })
    } else {
      reply.code(500).send({ error: 'Failed to delete post' })
    }
  }
}
