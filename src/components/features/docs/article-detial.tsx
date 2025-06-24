import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Clock, MessageCircle } from "lucide-react"
import type { ArticleDetailData } from '@mock/docs/detail'
import MarkdownRender from '@/components/features/docs/markdown-render'
interface Author {
  name: string
  avatar?: string
  bio: string
}

interface ArticleDetailProps {
  title: string
  author: Author
  createAt: string
  readTime: string
  category: string
  tags: string[]
  summary: string
  content: string
}

export function ArticleDetail({
  title,
  author,
  createdAt,
  readTime,
  category,
  tags,
  summary,
  content,
}: ArticleDetailData) {

  return (
    <article className="rounded-lg">
      {/* 文章头部 */}
      <header className="p-8 pb-6">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="default">{category}</Badge>
          {tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>

        <h1 className="text-3xl font-bold mb-6 leading-tight">{title}</h1>

        {/* <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={author.avatar || "/placeholder.svg"} alt={author.name} />
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-gray-900">{author.name}</p>
              <p className="text-sm text-gray-600">{author.bio}</p>
            </div>
          </div>
        </div> */}

        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{createdAt}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{readTime}</span>
          </div>
        </div>
      </header>

      <Separator />

      {/* GPT 摘要区域 */}
      <div className="p-8 py-6">
        <Card className="bg-theme-accent/20 border-theme-primary/90">
          <CardContent className="px-6 py-3">
            <div className="flex items-start gap-3">
              <div className="bg-theme-primary/30 rounded-full p-2">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">AI 生成摘要</h3>
                <p className="leading-relaxed">{summary}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 文章主体 */}
      <div className="px-8 pb-8">
        <div className="prose prose-lg max-w-none">
          <MarkdownRender content={content} />
        </div>
      </div>
    </article>
  )
}
