import { Post } from './prisma';

export interface PostRequest {
  title: string;
  content?: string;
  published?: boolean;
  authorId: number;
}

export interface PostResponse {
  data: Post | Post[];
  error?: string;
}

export interface PostController {
  getAllPosts: (req: any, reply: any) => Promise<void>;
  getPostById: (req: any, reply: any) => Promise<void>;
  createPost: (req: any, reply: any) => Promise<void>;
  updatePost: (req: any, reply: any) => Promise<void>;
  deletePost: (req: any, reply: any) => Promise<void>;
}
