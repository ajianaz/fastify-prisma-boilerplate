import { User } from './prisma';

export interface UserRequest {
  email: string;
  name?: string;
}

export interface UserResponse {
  data: User | User[];
  error?: string;
}

export interface UserController {
  getAllUsers: (req: any, reply: any) => Promise<void>;
  getUserById: (req: any, reply: any) => Promise<void>;
  createUser: (req: any, reply: any) => Promise<void>;
  updateUser: (req: any, reply: any) => Promise<void>;
  deleteUser: (req: any, reply: any) => Promise<void>;
}
