import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Clock, MessageCircle, Eye } from "lucide-react"
import type { Article } from '@/types/article'
import { formatArticleDate, formatReadTime, getAuthorDisplayName } from "@/utils/article-transform"
import MarkdownRender from '@/components/features/docs/markdown-render'

interface ArticleDetailProps {
  article: Article
}

export function ArticleDetail({ article }: ArticleDetailProps) {

  return (
    <article className="rounded-lg">
      {/* 文章头部 */}
      <header className="pb-6">
        {/* 封面图片 */}
        {article.coverImage && (
          <div className="mb-6 rounded-lg overflow-hidden">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        {/* 分类和标签 */}
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="default">{article.category}</Badge>
          {article.articleTags.map((articleTag) => (
            <Badge
              key={articleTag.tag.id}
              variant="outline"
              style={{
                borderColor: articleTag.tag.color || undefined,
                color: articleTag.tag.color || undefined
              }}
            >
              {articleTag.tag.name}
            </Badge>
          ))}
        </div>

        <h1 className="text-3xl font-bold mb-6 leading-tight">{article.title}</h1>

        {/* 作者信息 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={article.user.imageUrl || undefined} alt={getAuthorDisplayName(article.user)} />
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-gray-900">{getAuthorDisplayName(article.user)}</p>
              <p className="text-sm text-gray-600">@{article.user.username}</p>
            </div>
          </div>
        </div>

        {/* 文章元信息 */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatArticleDate(article.createdAt)}</span>
          </div>
          {article.readTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatReadTime(article.readTime)}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{article.viewCount} 次阅读</span>
          </div>
        </div>
      </header>

      <Separator />

      {/* 文章摘要区域 */}
      {article.summary && (
        <div className="p-8 py-6">
          <Card className="bg-theme-accent/20 border-theme-primary/90">
            <CardContent className="px-6 py-3">
              <div className="flex items-start gap-3">
                <div className="bg-theme-primary/30 rounded-full p-2">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">文章摘要</h3>
                  <p className="leading-relaxed">{article.summary}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 文章主体 */}
      <div className="px-8 pb-8">
        <div className="prose prose-lg max-w-none">
          <MarkdownRender content={article.content} />
        </div>
      </div>
    </article>
  )
}
