import { apiGet, apiPost, apiPatch, apiDelete, buildQueryParams, ApiResponse, PaginationResult } from '../api';

// 文章数据类型（基于后端 Prisma 模型）
export interface User {
  id: number;
  username: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  color: string | null;
  description: string | null;
}

export interface ArticleTag {
  tag: Tag;
  createdAt: string;
}

export interface Article {
  id: number;
  slug: string;
  title: string;
  summary: string | null;
  content: string;
  html: string | null;
  coverImage: string | null;
  readTime: number | null;
  category: string;
  isPublished: boolean;
  isDraft: boolean;
  viewCount: number;
  likes: number;
  bookmarks: number;
  comments: number;
  userId: number;
  user: User;
  articleTags: ArticleTag[];
  createdAt: string;
  updatedAt: string;
  _count?: {
    messages: number;
  };
}

// 文章查询参数
export interface ArticleQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  tags?: string;
  userId?: number;
  isPublished?: boolean;
  isDraft?: boolean;
  author?: string;
  tag?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 创建文章 DTO
export interface CreateArticleDto {
  slug: string;
  title: string;
  summary?: string;
  content: string;
  html?: string;
  coverImage?: string;
  readTime?: number;
  category: string;
  isPublished?: boolean;
  isDraft?: boolean;
  tags?: string[];
  userId: number;
}

// 更新文章 DTO
export interface UpdateArticleDto extends Partial<CreateArticleDto> {}

// 文章 API 服务
export class ArticlesApi {
  // 获取文章列表
  static async getArticles(params: ArticleQueryParams = {}): Promise<ApiResponse<PaginationResult<Article>>> {
    const queryString = buildQueryParams(params);
    return apiGet<PaginationResult<Article>>(`/articles${queryString}`);
  }

  // 获取文章详情（通过 ID）
  static async getArticleById(id: number): Promise<ApiResponse<Article>> {
    return apiGet<Article>(`/articles/${id}`);
  }

  // 获取文章详情（通过 slug）
  static async getArticleBySlug(slug: string): Promise<ApiResponse<Article>> {
    return apiGet<Article>(`/articles/slug/${slug}`);
  }

  // 获取文章分类列表
  static async getCategories(): Promise<ApiResponse<string[]>> {
    return apiGet<string[]>('/articles/categories');
  }

  // 获取热门文章
  static async getPopularArticles(limit?: number): Promise<ApiResponse<Article[]>> {
    const queryString = limit ? buildQueryParams({ limit }) : '';
    return apiGet<Article[]>(`/articles/popular${queryString}`);
  }

  // 获取最新文章
  static async getRecentArticles(limit?: number): Promise<ApiResponse<Article[]>> {
    const queryString = limit ? buildQueryParams({ limit }) : '';
    return apiGet<Article[]>(`/articles/recent${queryString}`);
  }

  // 创建文章
  static async createArticle(data: CreateArticleDto): Promise<ApiResponse<Article>> {
    return apiPost<Article>('/articles', data);
  }

  // 更新文章
  static async updateArticle(id: number, data: UpdateArticleDto): Promise<ApiResponse<Article>> {
    return apiPatch<Article>(`/articles/${id}`, data);
  }

  // 发布文章
  static async publishArticle(id: number): Promise<ApiResponse<Article>> {
    return apiPatch<Article>(`/articles/${id}/publish`, {});
  }

  // 取消发布文章
  static async unpublishArticle(id: number): Promise<ApiResponse<Article>> {
    return apiPatch<Article>(`/articles/${id}/unpublish`, {});
  }

  // 点赞文章
  static async likeArticle(id: number): Promise<ApiResponse<Article>> {
    return apiPatch<Article>(`/articles/${id}/like`, {});
  }

  // 收藏文章
  static async bookmarkArticle(id: number): Promise<ApiResponse<Article>> {
    return apiPatch<Article>(`/articles/${id}/bookmark`, {});
  }

  // 删除文章
  static async deleteArticle(id: number): Promise<ApiResponse<Article>> {
    return apiDelete<Article>(`/articles/${id}`);
  }
}

// 导出便捷方法
export const {
  getArticles,
  getArticleById,
  getArticleBySlug,
  getCategories,
  getPopularArticles,
  getRecentArticles,
  createArticle,
  updateArticle,
  publishArticle,
  unpublishArticle,
  likeArticle,
  bookmarkArticle,
  deleteArticle,
} = ArticlesApi;
