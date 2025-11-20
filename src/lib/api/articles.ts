import { api, ApiResponse } from './client';
import { Article, PaginatedArticles } from '@/types/article';

const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
};

export const articlesApi = {
    list: (params: Record<string, any> = {}) =>
        api.get<PaginatedArticles>('/articles', params),

    getById: (id: string | number) =>
        api.get<Article>(`/articles/${id}`),

    getBySlug: (slug: string) =>
        api.get<Article>(`/articles/slug/${slug}`),

    getRecent: (limit = 10) =>
        api.get<Article[]>('/articles/recent', { limit }),

    getPopular: (limit = 10) =>
        api.get<Article[]>('/articles/popular', { limit }),

    getCategories: () =>
        api.get<any[]>('/articles/categories'),

    like: (id: number) =>
        api.post<Article>(`/articles/${id}/like`),

    bookmark: (id: number) =>
        api.post<Article>(`/articles/${id}/bookmark`),

    // Comments
    comments: {
        list: (articleId: number) =>
            api.get<any[]>(`/articles/${articleId}/comments`),

        create: (articleId: number, content: string) =>
            api.post<any>(`/articles/${articleId}/comments`, { content }),

        reply: (articleId: number, commentId: number, content: string) =>
            api.post<any>(`/articles/${articleId}/comments/${commentId}/reply`, { content }),

        like: (articleId: number, commentId: number) =>
            api.post<any>(`/articles/${articleId}/comments/${commentId}/like`),
    }
};
