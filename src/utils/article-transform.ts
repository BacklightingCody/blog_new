// 文章数据转换工具函数
import type { Article, LegacyArticle, ArticleListItem } from '@/types/article';

/**
 * 将新的 Article 类型转换为旧的 LegacyArticle 类型
 * 用于兼容现有组件的渐进式迁移
 */
export function articleToLegacy(article: Article): LegacyArticle {
  return {
    id: article.id,
    title: article.title,
    date: new Date(article.createdAt).toISOString().split('T')[0], // 转换为 YYYY-MM-DD 格式
    category: article.category,
    slug: article.slug,
    tags: article.articleTags.map(at => at.tag.name),
    views: article.viewCount,
    likes: article.likes,
    comments: article.comments,
  };
}

/**
 * 将旧的 LegacyArticle 类型转换为新的 Article 类型的部分字段
 * 用于向后兼容
 */
export function legacyToArticle(legacy: LegacyArticle): Partial<Article> {
  return {
    id: legacy.id,
    title: legacy.title,
    createdAt: new Date(legacy.date).toISOString(),
    category: legacy.category,
    slug: legacy.slug,
    viewCount: legacy.views,
    likes: legacy.likes,
    comments: legacy.comments,
    // 其他字段使用默认值
    summary: null,
    content: '',
    html: null,
    coverImage: null,
    readTime: null,
    isPublished: true,
    isDraft: false,
    bookmarks: 0,
    userId: 1, // 默认用户ID
    user: {
      id: 1,
      username: 'default',
      firstName: null,
      lastName: null,
      imageUrl: null,
    },
    articleTags: legacy.tags.map((tagName, index) => ({
      tag: {
        id: index + 1,
        name: tagName,
        slug: tagName.toLowerCase().replace(/\s+/g, '-'),
        color: null,
        description: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
    })),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * 将完整的 Article 转换为列表项 ArticleListItem
 * 用于列表页面的性能优化
 */
export function articleToListItem(article: Article): ArticleListItem {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    summary: article.summary,
    coverImage: article.coverImage,
    readTime: article.readTime,
    category: article.category,
    viewCount: article.viewCount,
    likes: article.likes,
    bookmarks: article.bookmarks,
    comments: article.comments,
    user: {
      id: article.user.id,
      username: article.user.username,
      firstName: article.user.firstName,
      lastName: article.user.lastName,
      imageUrl: article.user.imageUrl,
    },
    articleTags: article.articleTags.map(at => ({
      tag: {
        id: at.tag.id,
        name: at.tag.name,
        color: at.tag.color,
      },
    })),
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
  };
}

/**
 * 格式化文章创建时间为友好的显示格式
 */
export function formatArticleDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return '今天';
  } else if (diffInDays === 1) {
    return '昨天';
  } else if (diffInDays < 7) {
    return `${diffInDays}天前`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks}周前`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `${months}个月前`;
  } else {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}

/**
 * 格式化阅读时间
 */
export function formatReadTime(minutes: number | null): string {
  if (!minutes) return '未知';
  if (minutes < 1) return '1分钟阅读';
  return `${Math.round(minutes)}分钟阅读`;
}

/**
 * 生成文章摘要（如果没有提供摘要）
 */
export function generateSummary(content: string, maxLength: number = 150): string {
  // 移除 Markdown 语法
  const plainText = content
    .replace(/#{1,6}\s+/g, '') // 移除标题
    .replace(/\*\*(.*?)\*\*/g, '$1') // 移除粗体
    .replace(/\*(.*?)\*/g, '$1') // 移除斜体
    .replace(/`(.*?)`/g, '$1') // 移除行内代码
    .replace(/```[\s\S]*?```/g, '') // 移除代码块
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 移除链接，保留文本
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // 移除图片
    .replace(/\n+/g, ' ') // 替换换行为空格
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return plainText.substring(0, maxLength).trim() + '...';
}

/**
 * 获取文章的主要标签颜色
 */
export function getArticleTagColor(article: Article): string {
  const firstTag = article.articleTags[0];
  return firstTag?.tag.color || '#6B7280'; // 默认灰色
}

/**
 * 检查文章是否为草稿
 */
export function isArticleDraft(article: Article): boolean {
  return article.isDraft || !article.isPublished;
}

/**
 * 获取文章作者显示名称
 */
export function getAuthorDisplayName(user: Article['user']): string {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  if (user.firstName) {
    return user.firstName;
  }
  return user.username;
}
