/**
 * 类型定义统一导出
 * 整合所有类型定义文件
 */

// 第三方模块声明 - 使用类型声明文件
// declare module 'hash-sum'; // 移除无效的模块声明
// declare module 'dom-to-image'; // 移除无效的模块声明

// 导出API相关类型
export type { ApiResponse as TypesApiResponse } from './api';
export * from './api';

// 导出文章相关类型  
// export * from './article'; // 注释掉以避免重复导出ApiResponse
export type { Article, ArticleTag, Tag } from './article';

// 导出通用类型
export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
  description?: string;
}

// 导出主题相关类型
export type ThemeMode = 'light' | 'dark' | 'system';
export type ThemeColor = 'red' | 'blue' | 'pink' | 'purple' | 'cyan' | 'orange' | 'yellow';

// 导出用户相关类型
export interface BaseUser {
  id: string | number;
  username: string;
  email?: string;
  avatar?: string;
}

// 导出通用状态类型
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// 导出表单相关类型
export interface FormField<T = any> {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio';
  value: T;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: SelectOption[];
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: T) => string | null;
  };
}

// 导出路由相关类型
export interface RouteInfo {
  path: string;
  title: string;
  description?: string;
  icon?: string;
  children?: RouteInfo[];
}

// 通用实体类型
export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}

// 异步状态类型
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// 表单状态类型
export interface FormState {
  isSubmitting: boolean;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

// 加载状态枚举
export type LoadingStatus = 'idle' | 'loading' | 'success' | 'error';

// 通用查询参数类型
export interface BaseQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 错误类型
export interface AppError {
  code: string;
  message: string;
  details?: any;
}