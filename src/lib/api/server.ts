/**
 * 服务端API客户端
 * 专门用于服务端组件调用后端API
 */

import { serverEnv } from '@/config/env';

// 服务端API响应类型
export interface ServerApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  code?: number;
}

// 服务端API错误类
export class ServerApiError extends Error {
  public status: number;
  public code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ServerApiError';
    this.status = status;
    this.code = code;
  }
}

/**
 * 服务端API请求函数
 */
export async function serverApiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ServerApiResponse<T>> {
  try {
    // 构建完整的API URL
    const url = endpoint.startsWith('http') 
      ? endpoint 
      : `${serverEnv.backendApiUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    console.log('服务端API请求:', url);

    // 发送请求
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

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

      throw new ServerApiError(errorMessage, response.status);
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
    const result: ServerApiResponse<T> = {
      success: true,
      data,
      code: response.status,
    };

    console.log('服务端API响应成功:', result);
    return result;

  } catch (error) {
    console.error('服务端API请求失败:', error);
    
    // 返回错误响应
    const errorResponse: ServerApiResponse<T> = {
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      message: error instanceof Error ? error.message : '未知错误',
      code: error instanceof ServerApiError ? error.status : 500,
    };

    return errorResponse;
  }
}

/**
 * GET 请求
 */
export async function serverGet<T = any>(
  endpoint: string,
  params?: Record<string, any>,
  options?: RequestInit
): Promise<ServerApiResponse<T>> {
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

  return serverApiRequest<T>(url, {
    ...options,
    method: 'GET',
  });
}

/**
 * POST 请求
 */
export async function serverPost<T = any>(
  endpoint: string,
  data?: any,
  options?: RequestInit
): Promise<ServerApiResponse<T>> {
  return serverApiRequest<T>(endpoint, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

// 导出服务端API客户端
export const serverApi = {
  get: serverGet,
  post: serverPost,
  request: serverApiRequest,
};
