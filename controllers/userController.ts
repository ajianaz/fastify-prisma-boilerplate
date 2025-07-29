import { FastifyRequest, FastifyReply } from 'fastify'
import * as userService from '../services/userService'
import { User } from '@prisma/client'

interface UserParams {
  id: string
}

interface UserBody {
  email: string
  name?: string
}

export const getAllUsers = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const users = await userService.getAllUsers()
    reply.send({ data: users })
  } catch (error) {
    reply.code(500).send({ error: 'Failed to fetch users' })
  }
}

export const getUserById = async (req: FastifyRequest<{ Params: UserParams }>, reply: FastifyReply) => {
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
}

export const createUser = async (req: FastifyRequest<{ Body: UserBody }>, reply: FastifyReply) => {
  try {
    const { email, name } = req.body
    const user = await userService.createUser({ email, name })
    reply.code(201).send({ data: user })
  } catch (error: any) {
    if (error.code === 'P2002') {
      reply.code(400).send({ error: 'Email already exists' })
    } else {
      reply.code(500).send({ error: 'Failed to create user' })
    }
  }
}

export const updateUser = async (req: FastifyRequest<{ Params: UserParams, Body: UserBody }>, reply: FastifyReply) => {
  try {
    const { id } = req.params
    const { email, name } = req.body
    const updatedUser = await userService.updateUser(parseInt(id), {
      email,
      name
    })

    reply.send({ data: updatedUser })
  } catch (error: any) {
    if (error.code === 'P2025') {
      reply.code(404).send({ error: 'User not found' })
    } else if (error.code === 'P2002') {
      reply.code(400).send({ error: 'Email already exists' })
    } else {
      reply.code(500).send({ error: 'Failed to update user' })
    }
  }
}

export const deleteUser = async (req: FastifyRequest<{ Params: UserParams }>, reply: FastifyReply) => {
  try {
    const { id } = req.params
    await userService.deleteUser(parseInt(id))
    reply.code(204).send()
  } catch (error: any) {
    if (error.code === 'P2025') {
      reply.code(404).send({ error: 'User not found' })
    } else {
      reply.code(500).send({ error: 'Failed to delete user' })
    }
  }
}
