/**
 * 文章数据相关的 Hook
 */

import { useState, useEffect, useCallback } from 'react';
import { Article, ArticleQueryParams } from '@/types/article';
import { articlesApi } from '@/lib/api/articles';

export interface UseArticlesOptions extends ArticleQueryParams {
  enabled?: boolean;
  refetchOnMount?: boolean;
}

export interface UseArticlesReturn {
  articles: Article[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refetch: () => Promise<void>;
  search: (query: string) => Promise<void>;
}

export function useArticles(options: UseArticlesOptions = {}): UseArticlesReturn {
  const {
    enabled = true,
    refetchOnMount = true,
    ...queryParams
  } = options;

  const [articles, setArticles] = useState<Article[]>([]);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = useCallback(async (params: ArticleQueryParams = {}, append = false) => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const mergedParams = { ...queryParams, ...params };
      const response = await articlesApi.list(mergedParams);

      if (response.success && response.data) {
        const { data: newArticles, pagination: newPagination } = response.data;

        setArticles(prev => append ? [...prev, ...newArticles] : newArticles);
        setPagination(newPagination);
      } else {
        setError(response.error || 'Failed to fetch articles');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [enabled, queryParams]);

  const loadMore = useCallback(async () => {
    if (!pagination || pagination.page >= pagination.totalPages || loading) return;

    await fetchArticles({ page: pagination.page + 1 }, true);
  }, [pagination, loading, fetchArticles]);

  const refetch = useCallback(async () => {
    setArticles([]);
    setPagination(null);
    await fetchArticles();
  }, [fetchArticles]);

  const search = useCallback(async (query: string) => {
    setArticles([]);
    setPagination(null);
    await fetchArticles({ search: query, page: 1 });
  }, [fetchArticles]);

  // 初始加载
  useEffect(() => {
    if (enabled && refetchOnMount) {
      fetchArticles();
    }
  }, [enabled, refetchOnMount, fetchArticles]);

  const hasMore = pagination ? pagination.page < pagination.totalPages : false;

  return {
    articles,
    pagination,
    loading,
    error,
    hasMore,
    loadMore,
    refetch,
    search,
  };
}

/**
 * 获取单篇文章的 Hook
 */
export function useArticle(slug: string, enabled = true) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArticle = useCallback(async () => {
    if (!enabled || !slug) return;

    setLoading(true);
    setError(null);

    try {
      const response = await articlesApi.getBySlug(slug);

      if (response.success && response.data) {
        setArticle(response.data);
      } else {
        setError(response.error || 'Failed to fetch article');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [slug, enabled]);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

  return {
    article,
    loading,
    error,
    refetch: fetchArticle,
  };
}
