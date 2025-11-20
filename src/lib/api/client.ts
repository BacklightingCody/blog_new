/**
 * API 客户端
 * 统一的请求处理和错误管理
 */

import { appConfig } from '@/config';

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  code?: number;
}

// API 错误类
export class ApiError extends Error {
  public status: number;
  public code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

// 请求配置接口
export interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

// 默认配置
const DEFAULT_CONFIG: RequestConfig = {
  timeout: 10000,
  retries: 3,
  retryDelay: 1000,
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * 延迟函数
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 超时处理
 */
const withTimeout = <T>(promise: Promise<T>, timeout: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('请求超时')), timeout)
    ),
  ]);
};

/**
 * 统一的API请求函数
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestConfig = {}
): Promise<ApiResponse<T>> {
  const {
    timeout = DEFAULT_CONFIG.timeout,
    retries = DEFAULT_CONFIG.retries,
    retryDelay = DEFAULT_CONFIG.retryDelay,
    ...fetchOptions
  } = { ...DEFAULT_CONFIG, ...options };

  // 确保使用正确的API基础URL和路径
  const url = endpoint.startsWith('http') 
    ? endpoint 
    : `${appConfig.api.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  console.log('发送API请求到:', url);

  let lastError: Error = new Error('未知错误');

  // 重试逻辑
  for (let attempt = 0; attempt <= retries!; attempt++) {
    try {
      console.log(`API请求 (尝试 ${attempt + 1}/${retries! + 1}):`, url);

      const response = await withTimeout(
        fetch(url, {
          ...fetchOptions,
          headers: {
            ...DEFAULT_CONFIG.headers,
            ...fetchOptions.headers,
          },
        }),
        timeout!
      );

      // 处理HTTP错误状态
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // 如果不是JSON，使用原始文本
          if (errorText) {
            errorMessage = errorText;
          }
        }

        throw new ApiError(errorMessage, response.status);
      }

      // 解析响应
      const contentType = response.headers.get('content-type');
      let data: any;

      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      // 返回成功响应
      const result: ApiResponse<T> = {
        success: true,
        data,
        code: response.status,
      };

      console.log('API响应成功:', result);

      return result;

    } catch (error) {
      lastError = error as Error;

      console.error(`API请求失败 (尝试 ${attempt + 1}):`, error);

      // 如果是最后一次尝试，或者是不应该重试的错误，直接抛出
      if (
        attempt === retries ||
        error instanceof ApiError && error.status < 500
      ) {
        break;
      }

      // 等待后重试
      if (attempt < retries!) {
        await delay(retryDelay! * Math.pow(2, attempt)); // 指数退避
      }
    }
  }

  // 返回错误响应
  const errorResponse: ApiResponse<T> = {
    success: false,
    error: lastError.message,
    message: lastError.message,
    code: lastError instanceof ApiError ? lastError.status : 500,
  };

  console.error('API最终失败:', errorResponse);

  return errorResponse;
}

/**
 * GET 请求
 */
export async function get<T = any>(
  endpoint: string,
  params?: Record<string, any>,
  options?: RequestConfig
): Promise<ApiResponse<T>> {
  let url = endpoint;
  
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  return apiRequest<T>(url, {
    ...options,
    method: 'GET',
  });
}

/**
 * POST 请求
 */
export async function post<T = any>(
  endpoint: string,
  data?: any,
  options?: RequestConfig
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PUT 请求
 */
export async function put<T = any>(
  endpoint: string,
  data?: any,
  options?: RequestConfig
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * DELETE 请求
 */
export async function del<T = any>(
  endpoint: string,
  options?: RequestConfig
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'DELETE',
  });
}

/**
 * PATCH 请求
 */
export async function patch<T = any>(
  endpoint: string,
  data?: any,
  options?: RequestConfig
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });
}

// 导出默认的API客户端
export const api = {
  get,
  post,
  put,
  delete: del,
  patch,
  request: apiRequest,
};