/**
 * 基础服务类
 * 提供通用的 API 调用方法
 */

import { ApiResponse } from '@/lib/api/client';
import { PaginatedResponse } from '@/types/common';

export interface RequestConfig {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
}

export interface SearchParams {
  [key: string]: string | number | boolean | undefined | null;
}

export class BaseService {
  protected baseURL: string;

  constructor(baseURL = '') {
    this.baseURL = baseURL;
  }

  /**
   * 通用的 API 请求方法
   */
  protected async request<T = any>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      cache = 'default',
      next
    } = config;

    try {
      const url = `${this.baseURL}${endpoint}`;
      
      const requestInit: RequestInit & { next?: NextFetchRequestConfig } = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        cache,
      };

      if (body) {
        requestInit.body = JSON.stringify(body);
      }

      if (next) {
        requestInit.next = next;
      }

      const response = await fetch(url, requestInit);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error(`API Error [${method} ${endpoint}]:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * GET 请求
   */
  protected async get<T = any>(
    endpoint: string,
    params?: SearchParams,
    config?: Omit<RequestConfig, 'method' | 'body'>
  ): Promise<ApiResponse<T>> {
    let url = endpoint;
    
    if (params) {
      const searchParams = this.buildSearchParams(params);
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
    }

    return this.request<T>(url, { ...config, method: 'GET' });
  }

  /**
   * POST 请求
   */
  protected async post<T = any>(
    endpoint: string,
    data?: any,
    config?: Omit<RequestConfig, 'method' | 'body'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body: data });
  }

  /**
   * PUT 请求
   */
  protected async put<T = any>(
    endpoint: string,
    data?: any,
    config?: Omit<RequestConfig, 'method' | 'body'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body: data });
  }

  /**
   * PATCH 请求
   */
  protected async patch<T = any>(
    endpoint: string,
    data?: any,
    config?: Omit<RequestConfig, 'method' | 'body'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body: data });
  }

  /**
   * DELETE 请求
   */
  protected async delete<T = any>(
    endpoint: string,
    config?: Omit<RequestConfig, 'method' | 'body'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  /**
   * 构建查询参数
   */
  protected buildSearchParams(params: SearchParams): URLSearchParams {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    return searchParams;
  }

  /**
   * 处理分页响应
   */
  protected processPaginatedResponse<T>(
    response: ApiResponse<PaginatedResponse<T>>
  ): ApiResponse<PaginatedResponse<T>> {
    if (!response.success || !response.data) {
      return response;
    }

    // 确保分页数据结构正确
    const { data, pagination } = response.data;
    
    return {
      ...response,
      data: {
        data: Array.isArray(data) ? data : [],
        pagination: {
          page: pagination?.page || 1,
          limit: pagination?.limit || 10,
          total: pagination?.total || 0,
          totalPages: pagination?.totalPages || 0,
          hasNext: pagination?.hasNext || false,
          hasPrev: pagination?.hasPrev || false,
        },
      },
    };
  }
}

/**
 * 客户端服务基类
 */
export class ClientService extends BaseService {
  constructor() {
    super('/api');
  }
}

/**
 * 服务端服务基类
 */
export class ServerService extends BaseService {
  constructor() {
    // 服务端直接调用后端API
    super(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api');
  }
}