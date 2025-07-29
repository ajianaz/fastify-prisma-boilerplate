import { PrismaClient, User, Post } from '@prisma/client';

export type { User, Post };

export interface PrismaClientExtended extends PrismaClient {
  $connect: () => Promise<void>;
  $disconnect: () => Promise<void>;
}

export type UserCreateInput = {
  email: string;
  name?: string | null;
};

export type UserUpdateInput = {
  email?: string;
  name?: string | null;
};

export type PostCreateInput = {
  title: string;
  content?: string | null;
  published?: boolean;
  authorId: number;
};

export type PostUpdateInput = {
  title?: string;
  content?: string | null;
  published?: boolean;
  authorId?: number;
};
