/**
 * API 请求 Hook
 * 统一管理API请求状态和错误处理
 */

import { useState, useEffect, useCallback } from 'react';
import { ApiResponse } from '@/lib/api/client';
import { useAppStore } from '@/zustand';

export interface UseApiOptions<T> {
  // 是否立即执行
  immediate?: boolean;
  // 默认数据
  defaultData?: T;
  // 成功回调
  onSuccess?: (data: T) => void;
  // 错误回调
  onError?: (error: string) => void;
  // 依赖项
  deps?: any[];
}

export interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

/**
 * 通用API请求Hook
 */
export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<T>>,
  options: UseApiOptions<T> = {}
): UseApiResult<T> {
  const {
    immediate = false,
    defaultData = null,
    onSuccess,
    onError,
    deps = [],
  } = options;

  const [data, setData] = useState<T | null>(defaultData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { addNotification } = useAppStore();

  const execute = useCallback(async (...args: any[]): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiFunction(...args);

      if (response.success && response.data) {
        setData(response.data);
        onSuccess?.(response.data);
        return response.data;
      } else {
        const errorMessage = response.error || '请求失败';
        setError(errorMessage);
        onError?.(errorMessage);
        
        // 显示错误通知
        addNotification({
          type: 'error',
          title: '请求失败',
          message: errorMessage,
        });
        
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误';
      setError(errorMessage);
      onError?.(errorMessage);
      
      addNotification({
        type: 'error',
        title: '请求异常',
        message: errorMessage,
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, onSuccess, onError, addNotification]);

  const reset = useCallback(() => {
    setData(defaultData);
    setLoading(false);
    setError(null);
  }, [defaultData]);

  // 立即执行
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute, ...deps]);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

/**
 * 分页API请求Hook
 */
export function usePaginatedApi<T = any>(
  apiFunction: (params: any) => Promise<ApiResponse<{ data: T[]; pagination: any }>>,
  initialParams: any = {}
) {
  const [params, setParams] = useState({ page: 1, limit: 10, ...initialParams });
  const [allData, setAllData] = useState<T[]>([]);
  const [pagination, setPagination] = useState<any>(null);

  const { data, loading, error, execute } = useApi(apiFunction, {
    onSuccess: (response: any) => {
      if (params.page === 1) {
        setAllData(response.data);
      } else {
        setAllData((prev: T[]) => [...prev, ...response.data]);
      }
      setPagination(response.pagination);
    },
  });

  const loadMore = useCallback(() => {
    if (pagination?.hasNext && !loading) {
      setParams((prev: any) => ({ ...prev, page: prev.page + 1 }));
    }
  }, [pagination?.hasNext, loading]);

  const refresh = useCallback(() => {
    setParams((prev: any) => ({ ...prev, page: 1 }));
    setAllData([]);
  }, []);

  const updateParams = useCallback((newParams: any) => {
    setParams((prev: any) => ({ ...prev, ...newParams, page: 1 }));
    setAllData([]);
  }, []);

  useEffect(() => {
    execute(params);
  }, [execute, params]);

  return {
    data: allData,
    pagination,
    loading,
    error,
    loadMore,
    refresh,
    updateParams,
    hasMore: pagination?.hasNext || false,
  };
}

/**
 * 搜索API Hook
 */
export function useSearchApi<T = any>(
  searchFunction: (query: string, params?: any) => Promise<ApiResponse<T>>,
  debounceDelay: number = 300
) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const { data, loading, error, execute } = useApi(searchFunction, {
    onSuccess: (results) => {
      // 可以在这里处理搜索结果
    },
  });

  // 防抖处理
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceDelay);

    return () => clearTimeout(timer);
  }, [query, debounceDelay]);

  // 执行搜索
  useEffect(() => {
    if (debouncedQuery.trim()) {
      execute(debouncedQuery);
    }
  }, [debouncedQuery, execute]);

  const search = useCallback((searchQuery: string, params?: any) => {
    setQuery(searchQuery);
    if (searchQuery.trim()) {
      execute(searchQuery, params);
    }
  }, [execute]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
  }, []);

  return {
    query,
    setQuery,
    data,
    loading,
    error,
    search,
    clearSearch,
  };
}

/**
 * 表单提交API Hook
 */
export function useFormApi<T = any, D = any>(
  submitFunction: (data: D) => Promise<ApiResponse<T>>
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { addNotification } = useAppStore();

  const submit = useCallback(async (formData: D): Promise<T | null> => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const response = await submitFunction(formData);

      if (response.success && response.data) {
        addNotification({
          type: 'success',
          title: '提交成功',
          message: '操作已完成',
        });
        return response.data;
      } else {
        const errorMessage = response.error || '提交失败';
        setSubmitError(errorMessage);
        
        addNotification({
          type: 'error',
          title: '提交失败',
          message: errorMessage,
        });
        
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '提交异常';
      setSubmitError(errorMessage);
      
      addNotification({
        type: 'error',
        title: '提交异常',
        message: errorMessage,
      });
      
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [submitFunction, addNotification]);

  const reset = useCallback(() => {
    setIsSubmitting(false);
    setSubmitError(null);
  }, []);

  return {
    submit,
    isSubmitting,
    submitError,
    reset,
  };
}