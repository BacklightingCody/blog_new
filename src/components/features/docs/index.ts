/**
 * Docs 功能组件统一导出
 */

// 服务端组件
export { default as BlogListServer } from './blog-list-server';
export { default as BlogTimelineServer } from './blog-timeline-server';
export { RelatedArticlesServer } from './related-articles-server';

// 客户端组件
export { default as BlogList } from './blog-list';
export { default as BlogTimeline } from './blog-timeline';
export { RelatedArticles } from './related-articles';
export { ArticlePage } from './article-page';
export { ArticleLink } from './article-link';
export { ArticleActions } from './article-actions';
export { CommentSection } from './comment-section';
export { ShareDialog } from './share-dialog';
export { DocsNavDropdown } from './docs-nav-dropdown';
export { default as TimeStats } from './time-stats';
export { default as BreadcrumbNav } from './breadcrumb';

// 渲染组件
export { default as MarkdownRender } from './markdown-render';
export { CodeBlock, InlineCode } from './code-block';
export { MediaImage, MediaVideo, MediaGif } from './media-content';

// 废弃的组件（向后兼容）
export { default as ArticleDetailClient } from './article-detail-client';
