/**
 * 数据库API服务
 * 负责从后端获取文章数据，包含错误处理和数据转换功能
 * 实现数据合并策略和降级处理机制
 */

import { api } from './client';
import { serverApi } from './server';
import { Article, PaginationInfo } from '@/types/article';
import { mockArticles } from '@/mock/docs';

// 数据库文章响应类型
export interface DatabaseArticle {
  id: number;
  slug: string;
  title: string;
  summary?: string;
  content: string;
  category: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  author?: string;
  viewCount?: number;
  likes?: number;
  bookmarks?: number;
  isPublished: boolean;
  userId: number;
}

export interface DatabaseResponse<T> {
  success: boolean;
  data: {
    articles?: T[];
    docs?: T[];
    total: number;
    page: number;
    pageSize: number;
  };
  error?: string;
}

export interface CategoryResponse {
  success: boolean;
  data: {
    categories: Array<{
      id: string;
      name: string;
      description?: string;
      count: number;
    }>;
  };
  error?: string;
}

/**
 * 数据库文章格式转换为前端Article类型
 * 保证类型安全和数据完整性
 */
const convertDatabaseToArticle = (dbArticle: any): Article => {
  // 防御性编程：确保必要字段存在
  if (!dbArticle || !dbArticle.title || !dbArticle.content) {
    throw new Error('Invalid article data');
  }

  return {
    id: Number(dbArticle.id),
    slug: dbArticle.slug || dbArticle.id.toString(),
    title: dbArticle.title,
    summary: dbArticle.summary || dbArticle.content?.substring(0, 200) + '...',
    content: dbArticle.content,
    html: dbArticle.content, // 后端返回的content作为html
    coverImage: '/images/default-cover.jpg',
    readTime: Math.ceil((dbArticle.content?.length || 0) / 200),
    category: dbArticle.category || '未分类',
    // tags: Array.isArray(dbArticle.tags) ? dbArticle.tags : [], // 这行删除，因为Article类型没有tags字段
    isPublished: dbArticle.isPublished ?? true,
    isDraft: !dbArticle.isPublished,
    viewCount: Number(dbArticle.viewCount) || 0,
    likes: Number(dbArticle.likes) || 0,
    bookmarks: Number(dbArticle.bookmarks) || 0,
    comments: 0, // 暂时设为0，后续可扩展
    userId: Number(dbArticle.userId) || 1,
    user: {
      id: Number(dbArticle.userId) || 1,
      username: dbArticle.author || 'unknown',
      firstName: '',
      lastName: '',
      imageUrl: '/avatars/default.jpg',
    },
    articleTags: (Array.isArray(dbArticle.tags) ? dbArticle.tags : []).map((tag: string) => ({
      tag: {
        id: Math.random(),
        name: tag,
        slug: tag.toLowerCase().replace(/\s+/g, '-'),
        color: '#3b82f6',
        description: '',
        createdAt: dbArticle.createdAt || new Date().toISOString(),
        updatedAt: dbArticle.updatedAt || new Date().toISOString(),
      },
      createdAt: dbArticle.createdAt || new Date().toISOString(),
      updatedAt: dbArticle.updatedAt || new Date().toISOString(),
    })),
    createdAt: dbArticle.createdAt || new Date().toISOString(),
    updatedAt: dbArticle.updatedAt || new Date().toISOString(),
  };
};

/**
 * 数据合并策略
 * 当数据库数据不足时，使用mock数据补充
 */
const mergeArticles = (dbArticles: Article[], mockArticles: Article[]): Article[] => {
  if (dbArticles.length >= 10) {
    return dbArticles;
  }

  // 如果数据库数据不足，用mock数据补充
  const merged = [...dbArticles];
  const usedIds = new Set(dbArticles.map(a => a.id));

  for (const mockArticle of mockArticles) {
    if (merged.length >= 10) break;
    if (!usedIds.has(mockArticle.id)) {
      merged.push(mockArticle);
      usedIds.add(mockArticle.id);
    }
  }

  return merged;
};

/**
 * 获取数据库文章数据
 * 支持useDatabase参数控制数据源，实现灵活切换
 */
export const getDatabaseArticles = async (params: {
  category?: string;
  page?: number;
  limit?: number;
  search?: string;
  useDatabase?: boolean;
} = {}): Promise<{ articles: Article[]; pagination: PaginationInfo }> => {
  // 环境变量控制是否启用数据库
  const useDatabase = params.useDatabase ?? 
    (process.env.NEXT_PUBLIC_USE_DATABASE === 'true');

  // 如果不使用数据库，直接返回mock数据
  if (!useDatabase) {
    console.log('🔄 使用mock数据 (数据库已禁用)');
    let filteredArticles = mockArticles as unknown as Article[];
    
    // 分类过滤
    if (params.category) {
      filteredArticles = filteredArticles.filter(a => a.category === params.category);
    }
    
    // 搜索过滤
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredArticles = filteredArticles.filter(a => 
        a.title.toLowerCase().includes(searchLower) ||
        a.content.toLowerCase().includes(searchLower) ||
        a.summary?.toLowerCase().includes(searchLower)
      );
    }
    
    return {
      articles: filteredArticles,
      pagination: {
        page: 1,
        limit: 10,
        total: filteredArticles.length,
        totalPages: Math.ceil(filteredArticles.length / 10),
        hasNext: false,
        hasPrev: false,
      }
    };
  }

  try {
    console.log('🔄 尝试从数据库获取文章数据...');
    
    // 构建查询参数
    const searchParams = new URLSearchParams();
    if (params.category) searchParams.append('category', params.category);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('pageSize', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);
    
    const queryString = searchParams.toString();
    const url = queryString ? `docs/all?${queryString}` : 'docs/all';
    
    const response = await api.get<DatabaseResponse<any>>(url);
    
    if (!response.success || !response.data?.data) {
      throw new Error(response.error || '数据库响应无效');
    }

    console.log('✅ 数据库数据获取成功');
    
    // 转换数据库文章为前端类型
    const dbArticles = (response.data.data.docs || []).map(convertDatabaseToArticle);
    
    // 实现数据合并策略
    const mergedArticles = mergeArticles(dbArticles, mockArticles as unknown as Article[]);

    const pagination: PaginationInfo = {
      page: response.data.data.page || 1,
      limit: response.data.data.pageSize || 10,
      total: response.data.data.total || mergedArticles.length,
      totalPages: Math.ceil((response.data.data.total || mergedArticles.length) / (response.data.data.pageSize || 10)),
      hasNext: (response.data.data.page || 1) < Math.ceil((response.data.data.total || mergedArticles.length) / (response.data.data.pageSize || 10)),
      hasPrev: (response.data.data.page || 1) > 1,
    };

    return {
      articles: mergedArticles,
      pagination
    };

  } catch (error) {
    console.warn('⚠️ 数据库不可用，自动回退到mock数据:', error);
    
    // 降级处理：数据库不可用时自动回退到mock数据，确保用户体验
    let filteredArticles = mockArticles as unknown as Article[];
    
    // 应用筛选条件
    if (params.category) {
      filteredArticles = filteredArticles.filter(a => a.category === params.category);
    }
    
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredArticles = filteredArticles.filter(a => 
        a.title.toLowerCase().includes(searchLower) ||
        a.content.toLowerCase().includes(searchLower) ||
        a.summary?.toLowerCase().includes(searchLower)
      );
    }
    
    return {
      articles: filteredArticles,
      pagination: {
        page: params.page || 1,
        limit: params.limit || 10,
        total: filteredArticles.length,
        totalPages: Math.ceil(filteredArticles.length / (params.limit || 10)),
        hasNext: (params.page || 1) < Math.ceil(filteredArticles.length / (params.limit || 10)),
        hasPrev: (params.page || 1) > 1,
      }
    };
  }
};

/**
 * 根据分类获取数据库文章
 */
export const getDatabaseArticlesByCategory = async (
  categoryName: string,
  params: {
    page?: number;
    limit?: number;
    useDatabase?: boolean;
  } = {}
): Promise<{ articles: Article[]; pagination: PaginationInfo }> => {
  return getDatabaseArticles({
    category: categoryName,
    ...params
  });
};

/**
 * 根据ID或slug获取单篇文章
 */
export const getDatabaseArticleById = async (
  id: string,
  useDatabase = true
): Promise<Article> => {
  if (!useDatabase) {
    const mockArticle = (mockArticles as unknown as Article[]).find(article => 
      article.id.toString() === id || article.slug === id
    );
    if (!mockArticle) {
      throw new Error('文章不存在');
    }
    return mockArticle;
  }

  try {
    console.log(`🔄 从数据库获取文章: ${id}`);
    
    const response = await api.get<{ success: boolean; data: any; error?: string }>(`docs/${id}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || '获取文章失败');
    }

    console.log('✅ 数据库文章获取成功');
    return convertDatabaseToArticle(response.data);

  } catch (error) {
    console.warn('⚠️ 数据库获取文章失败，尝试mock数据:', error);
    
    // 降级处理
    const mockArticle = (mockArticles as unknown as Article[]).find(article => 
      article.id.toString() === id || article.slug === id
    );
    if (!mockArticle) {
      throw new Error('文章不存在');
    }
    return mockArticle;
  }
};

/**
 * 获取数据库文章分类
 */
export const getDatabaseCategories = async (useDatabase = true) => {
  if (!useDatabase) {
    console.log('🔄 使用mock分类数据');
    const categories = Array.from(new Set((mockArticles as unknown as Article[]).map(article => article.category)))
      .map(name => ({
        id: name,
        name,
        description: `${name}相关文章`,
        count: (mockArticles as unknown as Article[]).filter(article => article.category === name).length
      }));
    
    return { categories };
  }

  try {
    console.log('🔄 从数据库获取分类数据...');
    
    const response = await api.get<CategoryResponse>('docs/categories');
    
    if (!response.success || !response.data?.data) {
      throw new Error(response.error || '获取分类失败');
    }

    console.log('✅ 数据库分类获取成功');
    return response.data.data;

  } catch (error) {
    console.warn('⚠️ 数据库获取分类失败，使用mock数据:', error);
    
    // 降级处理
    const categories = Array.from(new Set((mockArticles as unknown as Article[]).map(article => article.category)))
      .map(name => ({
        id: name,
        name,
        description: `${name}相关文章`,
        count: (mockArticles as unknown as Article[]).filter(article => article.category === name).length
      }));
    
    return { categories };
  }
};

/**
 * 搜索文章
 */
export const searchDatabaseArticles = async (
  query: string,
  params: {
    category?: string;
    page?: number;
    limit?: number;
    useDatabase?: boolean;
  } = {}
): Promise<{ articles: Article[]; pagination: PaginationInfo }> => {
  return getDatabaseArticles({
    search: query,
    ...params
  });
};

/**
 * 文章操作API函数
 */

/**
 * 点赞文章
 */
export const likeArticle = async (articleId: number): Promise<Article> => {
  try {
    console.log(`点赞文章: ${articleId}`);
    
    const response = await api.post<{ success: boolean; data: any; error?: string }>(`articles/${articleId}/like`);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || '点赞失败');
    }

    console.log('✅ 文章点赞成功');
    return convertDatabaseToArticle(response.data);

  } catch (error) {
    console.error('⚠️ 文章点赞失败:', error);
    throw new Error('点赞失败');
  }
};

/**
 * 收藏文章
 */
export const bookmarkArticle = async (articleId: number): Promise<Article> => {
  try {
    console.log(`收藏文章: ${articleId}`);
    
    const response = await api.post<{ success: boolean; data: any; error?: string }>(`articles/${articleId}/bookmark`);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || '收藏失败');
    }

    console.log('✅ 文章收藏成功');
    return convertDatabaseToArticle(response.data);

  } catch (error) {
    console.error('⚠️ 文章收藏失败:', error);
    throw new Error('收藏失败');
  }
};

/**
 * 删除文章
 */
export const deleteArticle = async (articleId: number): Promise<boolean> => {
  try {
    console.log(`删除文章: ${articleId}`);
    
    const response = await api.delete<{ success: boolean; error?: string }>(`articles/${articleId}`);
    
    if (!response.success) {
      throw new Error(response.error || '删除失败');
    }

    console.log('✅ 文章删除成功');
    return true;

  } catch (error) {
    console.error('⚠️ 文章删除失败:', error);
    throw new Error('删除失败');
  }
};

/**
 * 评论操作API函数
 */

/**
 * 获取文章评论
 */
export const getArticleComments = async (
  articleId: number,
  params: {
    page?: number;
    limit?: number;
  } = {}
): Promise<{ comments: any[]; pagination: PaginationInfo }> => {
  try {
    console.log(`获取文章评论: ${articleId}`);
    
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    
    const queryString = searchParams.toString();
    const url = queryString ? `articles/${articleId}/comments?${queryString}` : `articles/${articleId}/comments`;
    
    const response = await api.get<{ success: boolean; data: any; error?: string }>(url);
    
    if (!response.success || !response.data) {
      throw new Error(response.error || '获取评论失败');
    }

    console.log('✅ 评论获取成功');
    
    // 转换评论数据格式
    const comments = (response.data.data || []).map((comment: any) => ({
      id: comment.id,
      content: comment.content,
      user: comment.user,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      likes: comment.likes || 0,
    }));

    const pagination: PaginationInfo = {
      page: response.data.pagination?.page || 1,
      limit: response.data.pagination?.limit || 20,
      total: response.data.pagination?.total || comments.length,
      totalPages: response.data.pagination?.totalPages || 1,
      hasNext: response.data.pagination?.hasNext || false,
      hasPrev: response.data.pagination?.hasPrev || false,
    };

    return { comments, pagination };

  } catch (error) {
    console.error('⚠️ 获取评论失败:', error);
    return {
      comments: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      }
    };
  }
};

/**
 * 发表评论
 */
export const postComment = async (
  articleId: number,
  content: string,
  userId: number = 1
): Promise<any> => {
  try {
    console.log(`发表评论到文章: ${articleId}`);
    
    const response = await api.post<{ success: boolean; data: any; error?: string }>(
      `articles/${articleId}/comments`,
      { content, userId }
    );
    
    if (!response.success || !response.data) {
      throw new Error(response.error || '发表评论失败');
    }

    console.log('✅ 评论发表成功');
    return response.data;

  } catch (error) {
    console.error('⚠️ 发表评论失败:', error);
    throw new Error('发表评论失败');
  }
};

/**
 * 回复评论
 */
export const replyToComment = async (
  articleId: number,
  commentId: number,
  content: string,
  userId: number = 1
): Promise<any> => {
  try {
    console.log(`回复评论: 文章${articleId}/评论${commentId}`);
    
    const response = await api.post<{ success: boolean; data: any; error?: string }>(
      `articles/${articleId}/comments/${commentId}/reply`,
      { content, userId }
    );
    
    if (!response.success || !response.data) {
      throw new Error(response.error || '回复评论失败');
    }

    console.log('✅ 评论回复成功');
    return response.data;

  } catch (error) {
    console.error('⚠️ 回复评论失败:', error);
    throw new Error('回复评论失败');
  }
};

/**
 * 点赞评论
 */
export const likeComment = async (
  articleId: number,
  commentId: number,
  userId: number = 1
): Promise<boolean> => {
  try {
    console.log(`点赞评论: 文章${articleId}/评论${commentId}`);
    
    const response = await api.post<{ success: boolean; error?: string }>(
      `articles/${articleId}/comments/${commentId}/like`,
      { userId }
    );
    
    if (!response.success) {
      throw new Error(response.error || '点赞评论失败');
    }

    console.log('✅ 评论点赞成功');
    return true;

  } catch (error) {
    console.error('⚠️ 评论点赞失败:', error);
    throw new Error('点赞评论失败');
  }
};

/**
 * 删除评论
 */
export const deleteComment = async (
  articleId: number,
  commentId: number,
  userId: number = 1
): Promise<boolean> => {
  try {
    console.log(`删除评论: 文章${articleId}/评论${commentId}`);
    
    // 传递userId作为请求体数据
    const response = await api.request<{ success: boolean; error?: string }>(
      `articles/${articleId}/comments/${commentId}`,
      {
        method: 'DELETE',
        body: JSON.stringify({ userId }),
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    
    if (!response.success) {
      throw new Error(response.error || '删除评论失败');
    }

    console.log('✅ 评论删除成功');
    return true;

  } catch (error) {
    console.error('⚠️ 删除评论失败:', error);
    throw new Error('删除评论失败');
  }
};

// ==================== 服务端专用函数 ====================

/**
 * 服务端获取数据库文章数据
 * 专门用于服务端组件，使用服务端API客户端
 */
export const getServerDatabaseArticles = async (params: {
  category?: string;
  page?: number;
  limit?: number;
  search?: string;
  useDatabase?: boolean;
} = {}): Promise<{ articles: Article[]; pagination: PaginationInfo }> => {
  // 环境变量控制是否启用数据库
  const useDatabase = params.useDatabase ?? 
    (process.env.NEXT_PUBLIC_USE_DATABASE === 'true');

  // 如果不使用数据库，直接返回mock数据
  if (!useDatabase) {
    console.log('🔄 服务端使用mock数据 (数据库已禁用)');
    let filteredArticles = mockArticles as unknown as Article[];
    
    // 分类过滤
    if (params.category) {
      filteredArticles = filteredArticles.filter(a => a.category === params.category);
    }
    
    // 搜索过滤
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredArticles = filteredArticles.filter(a => 
        a.title.toLowerCase().includes(searchLower) ||
        a.content.toLowerCase().includes(searchLower) ||
        a.summary?.toLowerCase().includes(searchLower)
      );
    }
    
    return {
      articles: filteredArticles,
      pagination: {
        page: 1,
        limit: 10,
        total: filteredArticles.length,
        totalPages: Math.ceil(filteredArticles.length / 10),
        hasNext: false,
        hasPrev: false,
      }
    };
  }

  try {
    console.log('🔄 服务端尝试从数据库获取文章数据...');
    
    // 构建查询参数
    const searchParams = new URLSearchParams();
    if (params.category) searchParams.append('category', params.category);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('pageSize', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);
    
    const queryString = searchParams.toString();
    const url = queryString ? `docs/all?${queryString}` : 'docs/all';
    
    const response = await serverApi.get<DatabaseResponse<any>>(url);
    
    if (!response.success || !response.data?.data) {
      throw new Error(response.error || '数据库响应无效');
    }

    console.log('✅ 服务端数据库数据获取成功');
    
    // 转换数据库文章为前端类型
    const dbArticles = (response.data.data.docs || []).map(convertDatabaseToArticle);
    
    // 实现数据合并策略
    const mergedArticles = mergeArticles(dbArticles, mockArticles as unknown as Article[]);

    const pagination: PaginationInfo = {
      page: response.data.data.page || 1,
      limit: response.data.data.pageSize || 10,
      total: response.data.data.total || mergedArticles.length,
      totalPages: Math.ceil((response.data.data.total || mergedArticles.length) / (response.data.data.pageSize || 10)),
      hasNext: (response.data.data.page || 1) < Math.ceil((response.data.data.total || mergedArticles.length) / (response.data.data.pageSize || 10)),
      hasPrev: (response.data.data.page || 1) > 1,
    };

    return {
      articles: mergedArticles,
      pagination
    };

  } catch (error) {
    console.warn('⚠️ 服务端数据库不可用，自动回退到mock数据:', error);
    
    // 降级处理：数据库不可用时自动回退到mock数据，确保用户体验
    let filteredArticles = mockArticles as unknown as Article[];
    
    // 应用筛选条件
    if (params.category) {
      filteredArticles = filteredArticles.filter(a => a.category === params.category);
    }
    
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredArticles = filteredArticles.filter(a => 
        a.title.toLowerCase().includes(searchLower) ||
        a.content.toLowerCase().includes(searchLower) ||
        a.summary?.toLowerCase().includes(searchLower)
      );
    }
    
    return {
      articles: filteredArticles,
      pagination: {
        page: params.page || 1,
        limit: params.limit || 10,
        total: filteredArticles.length,
        totalPages: Math.ceil(filteredArticles.length / (params.limit || 10)),
        hasNext: (params.page || 1) < Math.ceil(filteredArticles.length / (params.limit || 10)),
        hasPrev: (params.page || 1) > 1,
      }
    };
  }
};

/**
 * 服务端根据分类获取数据库文章
 */
export const getServerDatabaseArticlesByCategory = async (
  categoryName: string,
  params: {
    page?: number;
    limit?: number;
    useDatabase?: boolean;
  } = {}
): Promise<{ articles: Article[]; pagination: PaginationInfo }> => {
  return getServerDatabaseArticles({
    category: categoryName,
    ...params
  });
};

/**
 * 服务端获取数据库文章分类
 */
export const getServerDatabaseCategories = async (useDatabase = true) => {
  if (!useDatabase) {
    console.log('🔄 服务端使用mock分类数据');
    const categories = Array.from(new Set((mockArticles as unknown as Article[]).map(article => article.category)))
      .map(name => ({
        id: name,
        name,
        description: `${name}相关文章`,
        count: (mockArticles as unknown as Article[]).filter(article => article.category === name).length
      }));
    
    return { categories };
  }

  try {
    console.log('🔄 服务端从数据库获取分类数据...');
    
    const response = await serverApi.get<CategoryResponse>('docs/categories');
    
    if (!response.success || !response.data?.data) {
      throw new Error(response.error || '获取分类失败');
    }

    console.log('✅ 服务端数据库分类获取成功');
    return response.data.data;

  } catch (error) {
    console.warn('⚠️ 服务端数据库获取分类失败，使用mock数据:', error);
    
    // 降级处理
    const categories = Array.from(new Set((mockArticles as unknown as Article[]).map(article => article.category)))
      .map(name => ({
        id: name,
        name,
        description: `${name}相关文章`,
        count: (mockArticles as unknown as Article[]).filter(article => article.category === name).length
      }));
    
    return { categories };
  }
};