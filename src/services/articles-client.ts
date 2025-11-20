/**
 * 客户端文章服务
 * 用于客户端组件中的文章数据操作
 */

import { ClientService } from './base';
import { Article, ArticleQueryParams, CreateArticleData, UpdateArticleData } from '@/types/article';
import { PaginatedResponse } from '@/types/common';

export class ArticlesClientService extends ClientService {
  /**
   * 获取文章列表
   */
  async getArticles(params?: ArticleQueryParams) {
    const response = await this.get<PaginatedResponse<Article>>('/articles', params);
    return this.processPaginatedResponse(response);
  }

  /**
   * 根据 slug 获取文章详情
   */
  async getArticleBySlug(slug: string) {
    return this.get<Article>(`/articles/slug/${slug}`);
  }

  /**
   * 根据 ID 获取文章详情
   */
  async getArticleById(id: number) {
    return this.get<Article>(`/articles/${id}`);
  }

  /**
   * 创建文章
   */
  async createArticle(data: CreateArticleData) {
    return this.post<Article>('/articles', data);
  }

  /**
   * 更新文章
   */
  async updateArticle(id: number, data: UpdateArticleData) {
    return this.put<Article>(`/articles/${id}`, data);
  }

  /**
   * 删除文章
   */
  async deleteArticle(id: number) {
    return this.delete(`/articles/${id}`);
  }

  /**
   * 点赞文章
   */
  async likeArticle(id: number) {
    return this.post(`/articles/${id}/like`);
  }

  /**
   * 收藏文章
   */
  async bookmarkArticle(id: number) {
    return this.post(`/articles/${id}/bookmark`);
  }

  /**
   * 搜索文章
   */
  async searchArticles(query: string, params?: Omit<ArticleQueryParams, 'search'>) {
    return this.getArticles({ ...params, search: query });
  }

  /**
   * 获取相关文章
   */
  async getRelatedArticles(articleId: number, limit = 4) {
    return this.get<Article[]>(`/articles/${articleId}/related`, { limit });
  }

  /**
   * 获取分类文章
   */
  async getArticlesByCategory(category: string, params?: Omit<ArticleQueryParams, 'category'>) {
    return this.getArticles({ ...params, category });
  }

  /**
   * 获取标签文章
   */
  async getArticlesByTag(tag: string, params?: Omit<ArticleQueryParams, 'tags'>) {
    return this.getArticles({ ...params, tags: tag });
  }

  /**
   * 获取热门文章
   */
  async getPopularArticles(limit = 10) {
    return this.get<Article[]>('/articles/popular', { limit });
  }

  /**
   * 获取最新文章
   */
  async getLatestArticles(limit = 10) {
    return this.get<Article[]>('/articles/latest', { limit });
  }
}

// 创建单例实例
export const articlesClientService = new ArticlesClientService();
