import prisma from '../lib/prisma'
import { User, UserCreateInput, UserUpdateInput } from '../types/prisma'

export const getAllUsers = async (): Promise<User[]> => {
  return prisma.user.findMany({
    include: { posts: true }
  })
}

export const getUserById = async (id: number): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { id },
    include: { posts: true }
  })
}

export const createUser = async (data: UserCreateInput): Promise<User> => {
  return prisma.user.create({
    data
  })
}

export const updateUser = async (
  id: number,
  data: UserUpdateInput
): Promise<User> => {
  return prisma.user.update({
    where: { id },
    data
  })
}

export const deleteUser = async (id: number): Promise<User> => {
  return prisma.user.delete({
    where: { id }
  })
}
