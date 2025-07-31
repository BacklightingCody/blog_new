// 第三方模块声明
declare module 'hash-sum';
declare module 'dom-to-image';

// 统一导出所有类型定义
export * from './article';

// 通用类型
export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}

// 通用 API 响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 通用分页类型
export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// 通用查询参数类型
export interface BaseQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 错误类型
export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// 加载状态类型
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// 通用状态类型
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