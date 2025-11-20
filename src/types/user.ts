// 基于后端Prisma schema的用户相关类型定义

/**
 * 用户角色枚举
 */
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

/**
 * 用户状态枚举
 */
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  BANNED = 'BANNED',
  PENDING = 'PENDING'
}

/**
 * 用户接口
 */
export interface User {
  id: number;
  clerkId: string | null;
  email: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  passwordHash: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * 会话接口
 */
export interface Session {
  id: number;
  token: string;
  userId: number;
  expiresAt: string;
  createdAt: string;
}

/**
 * 用户创建请求接口
 */
export interface CreateUserRequest {
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  clerkId?: string;
}

/**
 * 用户更新请求接口
 */
export interface UpdateUserRequest {
  username?: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  role?: UserRole;
  status?: UserStatus;
}

/**
 * 用户登录请求接口
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * 用户注册请求接口
 */
export interface RegisterRequest {
  email: string;
  password: string;
  username?: string;
  firstName?: string;
  lastName?: string;
}

/**
 * 认证响应接口
 */
export interface AuthResponse {
  user: User;
  session: Session;
  token: string;
}