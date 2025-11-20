/**
 * API 相关类型定义
 * 统一管理所有API相关的类型
 */

// 基础API响应类型
export interface BaseApiResponse {
  success: boolean;
  message?: string;
  code?: number;
  timestamp?: string;
}

// 成功响应类型
export interface SuccessApiResponse<T = any> extends BaseApiResponse {
  success: true;
  data: T;
}

// 错误响应类型
export interface ErrorApiResponse extends BaseApiResponse {
  success: false;
  error: string;
  details?: any;
}

// 联合类型
export type ApiResponse<T = any> = SuccessApiResponse<T> | ErrorApiResponse;

// 分页元数据
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// 分页响应类型
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// 排序类型
export type SortOrder = 'asc' | 'desc';

// 基础查询参数
export interface BaseQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
  search?: string;
}

// 日期范围查询
export interface DateRangeQuery {
  startDate?: string;
  endDate?: string;
}

// 状态过滤
export interface StatusFilter {
  isActive?: boolean;
  isPublished?: boolean;
  isDraft?: boolean;
}

// 请求配置
export interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  skipAuth?: boolean;
}

// API错误类型
export interface ApiErrorDetails {
  field?: string;
  code?: string;
  message: string;
}

// 批量操作响应
export interface BatchOperationResponse {
  successCount: number;
  failureCount: number;
  errors?: ApiErrorDetails[];
}

// 文件上传响应
export interface FileUploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

// 统计数据类型
export interface StatsData {
  [key: string]: number | string;
}

// 健康检查响应
export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  version: string;
  uptime: number;
  services: {
    database: 'connected' | 'disconnected';
    cache: 'connected' | 'disconnected';
    [key: string]: string;
  };
}