'use client';

import React, { useState } from 'react';
import { Article } from '@/types/article';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Heart, 
  Bookmark, 
  Share2, 
  Eye, 
  Clock, 
  Calendar,
  User,
  Tag
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import MarkdownRender from './markdown-render';
import { CommentSection } from '../docs/comment-section';
import { RelatedArticles } from './related-articles';
import { ShareDialog } from './share-dialog';

interface ArticlePageProps {
  article: Article;
}

export function ArticlePage({ article }: ArticlePageProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = () => {
    setShowShareDialog(true);
  };

  return (
    <div className="mx-auto py-8">
      <article className="rounded-lg shadow-lg overflow-hidden">
        {/* 文章头部 */}
        <div className="p-8">
          {/* 分类标签 */}
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary" className="text-sm">
              {article.category}
            </Badge>
            <span className="text-gray-400">•</span>
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <Calendar className="w-4 h-4" />
              {formatDistanceToNow(new Date(article.createdAt), {
                addSuffix: true,
                locale: zhCN
              })}
            </div>
          </div>

          {/* 文章标题 */}
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            {article.title}
          </h1>

          {/* 文章摘要 */}
          {article.summary && (
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              {article.summary}
            </p>
          )}

          {/* 作者信息和统计 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={`/images/avatars/${article.user.firstName?.toLowerCase() || 'default'}.jpg`} />
                <AvatarFallback>
                  <User className="w-6 h-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {article.user.firstName} {article.user.lastName}
                </p>
                <p className="text-sm text-gray-500">作者</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {article.viewCount || 0}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {article.readTime} 分钟阅读
              </div>
            </div>
          </div>

          {/* 封面图片 */}
          {article.coverImage && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          {/* 互动按钮 */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant={isLiked ? "default" : "outline"}
              size="sm"
              onClick={handleLike}
              className="flex items-center gap-2"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              {(article as any).likeCount || 0}
            </Button>

            <Button
              variant={isBookmarked ? "default" : "outline"}
              size="sm"
              onClick={handleBookmark}
              className="flex items-center gap-2"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              收藏
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              分享
            </Button>
          </div>

          <Separator className="mb-8" />
        </div>

        {/* 文章内容 */}
        <div className="px-8 pb-8">
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <MarkdownRender content={article.content} />
          </div>
        </div>

        {/* 文章标签 */}
        {article.articleTags && article.articleTags.length > 0 && (
          <div className="px-8 pb-8">
            <Separator className="mb-6" />
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">标签</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {article.articleTags.map((articleTag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-sm"
                  style={{ 
                    borderColor: articleTag.tag.color || '#666',
                    color: articleTag.tag.color || '#666'
                  }}
                >
                  {articleTag.tag.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* 相关文章推荐 */}
      <div className="mt-8">
        <RelatedArticles currentArticle={article} />
      </div>

      {/* 评论区域 - 暂时注释掉 */}
      <CommentSection articleId={article.id} />

      {/* 分享对话框 */}
      {showShareDialog && (
        <ShareDialog 
          article={article} 
          onClose={() => setShowShareDialog(false)} 
        />
      )}
    </div>
  );
}