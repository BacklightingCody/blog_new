/**
 * 应用常量定义
 * 统一管理应用中使用的常量
 */

// 应用信息
export const APP_INFO = {
  NAME: 'Blog New',
  VERSION: '1.0.0',
  DESCRIPTION: '现代化博客系统',
  AUTHOR: 'Blog Team',
  KEYWORDS: ['博客', '文章', 'Next.js', 'TypeScript'],
} as const;

// 路由常量
export const ROUTES = {
  HOME: '/',
  DOCS: '/docs',
  BOOKS: '/books',
  CHAT: '/chat',
  DEMO: '/demo',
  ABOUT: '/about',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  LOGIN: '/login',
  REGISTER: '/register',
} as const;

// API 端点
export const API_ENDPOINTS = {
  ARTICLES: '/articles',
  CATEGORIES: '/categories',
  TAGS: '/tags',
  USERS: '/users',
  COMMENTS: '/comments',
  UPLOAD: '/upload',
  SEARCH: '/search',
  STATS: '/stats',
} as const;

// 分页配置
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
} as const;

// 主题配置
export const THEME = {
  MODES: ['light', 'dark', 'system'] as const,
  COLORS: ['red', 'blue', 'pink', 'purple', 'cyan', 'orange', 'yellow'] as const,
  FONT_SIZES: ['small', 'medium', 'large'] as const,
  LINE_HEIGHTS: ['compact', 'normal', 'relaxed'] as const,
} as const;

// 文件上传配置
export const UPLOAD = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'text/plain', 'text/markdown'],
  MAX_FILES_COUNT: 5,
} as const;

// 表单验证规则
export const VALIDATION = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[a-zA-Z0-9_-]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  TITLE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 200,
  },
  CONTENT: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 50000,
  },
  SUMMARY: {
    MAX_LENGTH: 500,
  },
} as const;

// 缓存配置
export const CACHE = {
  KEYS: {
    USER_PREFERENCES: 'user_preferences',
    THEME_SETTINGS: 'theme_settings',
    READING_HISTORY: 'reading_history',
    BOOKMARKS: 'bookmarks',
    SEARCH_HISTORY: 'search_history',
  },
  TTL: {
    SHORT: 5 * 60 * 1000, // 5分钟
    MEDIUM: 30 * 60 * 1000, // 30分钟
    LONG: 24 * 60 * 60 * 1000, // 24小时
  },
} as const;

// 错误消息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  SERVER_ERROR: '服务器错误，请稍后重试',
  UNAUTHORIZED: '未授权访问，请先登录',
  FORBIDDEN: '权限不足，无法访问',
  NOT_FOUND: '请求的资源不存在',
  VALIDATION_ERROR: '输入数据验证失败',
  UPLOAD_ERROR: '文件上传失败',
  UNKNOWN_ERROR: '未知错误，请联系管理员',
} as const;

// 成功消息
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: '登录成功',
  LOGOUT_SUCCESS: '退出成功',
  REGISTER_SUCCESS: '注册成功',
  UPDATE_SUCCESS: '更新成功',
  DELETE_SUCCESS: '删除成功',
  SAVE_SUCCESS: '保存成功',
  UPLOAD_SUCCESS: '上传成功',
  COPY_SUCCESS: '复制成功',
} as const;

// 加载消息
export const LOADING_MESSAGES = {
  LOADING: '加载中...',
  SAVING: '保存中...',
  UPLOADING: '上传中...',
  DELETING: '删除中...',
  PROCESSING: '处理中...',
  SEARCHING: '搜索中...',
} as const;

// 占位符文本
export const PLACEHOLDERS = {
  SEARCH: '搜索文章、标签或作者...',
  TITLE: '请输入文章标题',
  SUMMARY: '请输入文章摘要（可选）',
  CONTENT: '请输入文章内容',
  COMMENT: '写下你的评论...',
  EMAIL: '请输入邮箱地址',
  PASSWORD: '请输入密码',
  USERNAME: '请输入用户名',
} as const;

// 默认值
export const DEFAULTS = {
  AVATAR: '/avatar.jpg',
  COVER_IMAGE: '/cover/default_cover_01.jpg',
  PAGE_SIZE: 10,
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 1000,
  ANIMATION_DURATION: 200,
} as const;

// 正则表达式
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^1[3-9]\d{9}$/,
  URL: /^https?:\/\/.+/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  CHINESE: /[\u4e00-\u9fa5]/g,
  ENGLISH_WORD: /[a-zA-Z]+/g,
} as const;

// 键盘快捷键
export const KEYBOARD_SHORTCUTS = {
  SEARCH: 'ctrl+k',
  NEW_ARTICLE: 'ctrl+n',
  SAVE: 'ctrl+s',
  PREVIEW: 'ctrl+p',
  BOLD: 'ctrl+b',
  ITALIC: 'ctrl+i',
  UNDERLINE: 'ctrl+u',
  CODE: 'ctrl+`',
} as const;

// 社交媒体链接
export const SOCIAL_LINKS = {
  GITHUB: 'https://github.com',
  TWITTER: 'https://twitter.com',
  TIKTOK: 'https://tiktok.com',
  EMAIL: 'mailto:contact@example.com',
} as const;

// 文章状态
export const ARTICLE_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
  DELETED: 'deleted',
} as const;

// 用户角色
export const USER_ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  AUTHOR: 'author',
  READER: 'reader',
} as const;

// 通知类型
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

// 排序选项
export const SORT_OPTIONS = {
  CREATED_AT_DESC: 'createdAt_desc',
  CREATED_AT_ASC: 'createdAt_asc',
  UPDATED_AT_DESC: 'updatedAt_desc',
  UPDATED_AT_ASC: 'updatedAt_asc',
  TITLE_ASC: 'title_asc',
  TITLE_DESC: 'title_desc',
  VIEW_COUNT_DESC: 'viewCount_desc',
  LIKES_DESC: 'likes_desc',
} as const;

// 导出所有常量的类型
export type RouteKey = keyof typeof ROUTES;
export type ThemeMode = typeof THEME.MODES[number];
export type ThemeColor = typeof THEME.COLORS[number];
export type FontSize = typeof THEME.FONT_SIZES[number];
export type LineHeight = typeof THEME.LINE_HEIGHTS[number];
export type ArticleStatus = typeof ARTICLE_STATUS[keyof typeof ARTICLE_STATUS];
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES];
export type SortOption = typeof SORT_OPTIONS[keyof typeof SORT_OPTIONS];