'use client';
import { motion } from 'framer-motion';
import { Clock, Eye, ThumbsUp, ArrowRight, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArticleLink } from './article-link';
import type { Article } from '@/types/article';
import { formatArticleDate, formatReadTime } from '@/utils/article-transform';
import { categoryColorMap } from '@/constants/index';

interface RelatedArticlesServerProps {
  articles: Article[];
  currentArticle: Article;
}

export function RelatedArticlesServer({ articles, currentArticle }: RelatedArticlesServerProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          相关推荐
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <RelatedArticleItem article={article} />
            </motion.div>
          ))}
          
          {/* 查看更多按钮 */}
          <div className="pt-4 border-t">
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => {
                window.location.href = `/docs/${currentArticle.category}`;
              }}
            >
              查看更多 {currentArticle.category} 文章
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface RelatedArticleItemProps {
  article: Article;
}

function RelatedArticleItem({ article }: RelatedArticleItemProps) {
  const categoryColor = categoryColorMap[article.category as keyof typeof categoryColorMap] || '#3b82f6';

  return (
    <div className="group space-y-3 p-4 rounded-lg border border-transparent hover:border-border hover:bg-muted/50 transition-all duration-200">
      {/* 文章标题 */}
      <div>
        <ArticleLink 
          article={article} 
          className="font-medium text-base group-hover:text-primary transition-colors line-clamp-2"
        >
          {article.title}
        </ArticleLink>
      </div>

      {/* 文章摘要 */}
      {article.summary && (
        <p className="text-sm text-muted-foreground line-clamp-2">
          {article.summary}
        </p>
      )}

      {/* 分类和标签 */}
      <div className="flex flex-wrap gap-2">
        <Badge 
          variant="secondary" 
          className="text-xs"
          style={{ 
            backgroundColor: `${categoryColor}20`,
            color: categoryColor,
            borderColor: categoryColor
          }}
        >
          {article.category}
        </Badge>
        
        {article.articleTags.slice(0, 2).map((articleTag) => (
          <Badge
            key={articleTag.tag.id}
            variant="outline"
            className="text-xs"
            style={{
              borderColor: articleTag.tag.color || undefined,
              color: articleTag.tag.color || undefined
            }}
          >
            {articleTag.tag.name}
          </Badge>
        ))}
        
        {article.articleTags.length > 2 && (
          <Badge variant="outline" className="text-xs">
            +{article.articleTags.length - 2}
          </Badge>
        )}
      </div>

      {/* 元信息 */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{formatArticleDate(article.createdAt)}</span>
        </div>
        
        {article.readTime && (
          <div className="flex items-center gap-1">
            <span>{formatReadTime(article.readTime)}</span>
          </div>
        )}
        
        <div className="flex items-center gap-1">
          <Eye className="h-3 w-3" />
          <span>{article.viewCount}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <ThumbsUp className="h-3 w-3" />
          <span>{article.likes}</span>
        </div>
      </div>
    </div>
  );
}
