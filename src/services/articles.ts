import type { ApiResponse, Article, PaginatedArticles } from '@/types/article'

const DEFAULT_HEADERS: HeadersInit = {
  'Content-Type': 'application/json',
}

function buildQuery(params: Record<string, unknown>): string {
  const usp = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    usp.set(key, String(value))
  })
  const q = usp.toString()
  return q ? `?${q}` : ''
}

export async function listArticles(params: {
  page?: number
  limit?: number
  search?: string
  category?: string
  tag?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
} = {}): Promise<ApiResponse<PaginatedArticles>> {
  const res = await fetch(`/api/articles${buildQuery(params)}`, {
    method: 'GET',
    headers: DEFAULT_HEADERS,
    cache: 'no-store',
  })
  return res.json()
}

export async function getArticleById(id: string | number): Promise<ApiResponse<Article>> {
  const res = await fetch(`/api/articles/${id}`, {
    method: 'GET',
    headers: DEFAULT_HEADERS,
    cache: 'no-store',
  })
  return res.json()
}

export async function getArticleBySlug(slug: string): Promise<ApiResponse<Article>> {
  const res = await fetch(`/api/articles/slug/${slug}`, {
    method: 'GET',
    headers: DEFAULT_HEADERS,
    cache: 'no-store',
  })
  return res.json()
}

export async function getRecentArticles(limit = 10): Promise<ApiResponse<Article[]>> {
  const res = await fetch(`/api/articles/recent${buildQuery({ limit })}`)
  return res.json()
}

export async function getPopularArticles(limit = 10): Promise<ApiResponse<Article[]>> {
  const res = await fetch(`/api/articles/popular${buildQuery({ limit })}`)
  return res.json()
}

export async function getCategories(): Promise<ApiResponse<any[]>> {
  const res = await fetch(`/api/articles/categories`)
  return res.json()
}

export async function likeArticle(id: number): Promise<ApiResponse<Article>> {
  const res = await fetch(`/api/articles/${id}/like`, { method: 'POST' })
  return res.json()
}

export async function bookmarkArticle(id: number): Promise<ApiResponse<Article>> {
  const res = await fetch(`/api/articles/${id}/bookmark`, { method: 'POST' })
  return res.json()
}

// Comments
export interface CreateCommentPayload { content: string }
export interface CreateReplyPayload { content: string }

export async function fetchComments(articleId: number): Promise<ApiResponse<any[]>> {
  const res = await fetch(`/api/articles/${articleId}/comments`, { cache: 'no-store' })
  return res.json()
}

export async function postComment(articleId: number, payload: CreateCommentPayload): Promise<ApiResponse<any>> {
  const res = await fetch(`/api/articles/${articleId}/comments`, {
    method: 'POST',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(payload),
  })
  return res.json()
}

export async function postReply(articleId: number, commentId: number, payload: CreateReplyPayload): Promise<ApiResponse<any>> {
  const res = await fetch(`/api/articles/${articleId}/comments/${commentId}/reply`, {
    method: 'POST',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(payload),
  })
  return res.json()
}

export async function likeComment(articleId: number, commentId: number): Promise<ApiResponse<any>> {
  const res = await fetch(`/api/articles/${articleId}/comments/${commentId}/like`, { method: 'POST' })
  return res.json()
}

