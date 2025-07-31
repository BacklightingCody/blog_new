// 基于后端 API 响应的文章相关类型定义

// 用户类型
export interface User {
  id: number;
  username: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
}

// 标签类型
export interface Tag {
  id: number;
  name: string;
  slug: string;
  color: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

// 文章标签关联类型
export interface ArticleTag {
  tag: Tag;
  createdAt: string;
}

// 评论类型（基于后端 Message 模型）
export interface Comment {
  id: number;
  content: string;
  user: User;
  createdAt: string;
  updatedAt: string;
}

// 完整的文章类型（对应后端 Article 模型）
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
  messages?: Comment[]; // 评论列表（可选，在详情页时包含）
  createdAt: string;
  updatedAt: string;
  _count?: {
    messages: number;
  };
}

// 文章列表项类型（简化版，用于列表展示）
export interface ArticleListItem {
  id: number;
  slug: string;
  title: string;
  summary: string | null;
  coverImage: string | null;
  readTime: number | null;
  category: string;
  viewCount: number;
  likes: number;
  bookmarks: number;
  comments: number;
  user: {
    id: number;
    username: string;
    firstName: string | null;
    lastName: string | null;
    imageUrl: string | null;
  };
  articleTags: {
    tag: {
      id: number;
      name: string;
      color: string | null;
    };
  }[];
  createdAt: string;
  updatedAt: string;
}

// 文章详情类型（包含完整信息）
export interface ArticleDetail extends Article {
  messages: Comment[];
}

// 文章查询参数类型
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

// 创建文章的数据类型
export interface CreateArticleData {
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

// 更新文章的数据类型
export interface UpdateArticleData extends Partial<CreateArticleData> {}

// 分页结果类型
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedArticles {
  data: Article[];
  pagination: PaginationInfo;
}

// API 响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 兼容旧版本的简化文章类型（用于渐进式迁移）
export interface LegacyArticle {
  id: number;
  title: string;
  date: string;
  category: string;
  slug: string;
  tags: string[];
  views: number;
  likes: number;
  comments: number;
}

// 类型转换工具函数类型
export type ArticleToLegacy = (article: Article) => LegacyArticle;
export type LegacyToArticle = (legacy: LegacyArticle) => Partial<Article>;
