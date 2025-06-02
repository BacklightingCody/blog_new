import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Clock, MessageCircle } from "lucide-react"

interface Author {
  name: string
  avatar?: string
  bio: string
}

interface ArticleDetailProps {
  title: string
  author: Author
  publishDate: string
  readTime: string
  category: string
  tags: string[]
  summary: string
  content: string
}

export function ArticleDetail({
  title,
  author,
  publishDate,
  readTime,
  category,
  tags,
  summary,
  content,
}: ArticleDetailProps) {
  const formatContent = (content: string) => {
    return content
      .split("\n\n")
      .map((paragraph) => {
        if (paragraph.startsWith("## ")) {
          return `<h2 class="text-2xl font-bold mt-8 mb-4 text-gray-900">${paragraph.slice(3)}</h2>`
        } else if (paragraph.startsWith("### ")) {
          return `<h3 class="text-xl font-semibold mt-6 mb-3 text-gray-900">${paragraph.slice(4)}</h3>`
        } else if (paragraph.startsWith("```")) {
          return `<pre class="bg-gray-100 rounded-lg p-4 overflow-x-auto my-4"><code class="text-sm">${paragraph.slice(3, -3)}</code></pre>`
        } else if (paragraph.match(/^\d+\./)) {
          return `<p class="mb-4 pl-4">${paragraph}</p>`
        } else {
          return `<p class="mb-4">${paragraph}</p>`
        }
      })
      .join("")
  }

  return (
    <article className="bg-white rounded-lg shadow-sm border">
      {/* 文章头部 */}
      <header className="p-8 pb-6">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary">{category}</Badge>
          {tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">{title}</h1>

        <div className="flex items-center justify-between mb-6">
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
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{publishDate}</span>
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
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 rounded-full p-2">
                <MessageCircle className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">AI 生成摘要</h3>
                <p className="text-blue-800 leading-relaxed">{summary}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 文章主体 */}
      <div className="px-8 pb-8">
        <div className="prose prose-lg max-w-none">
          <div
            className="text-gray-800 leading-relaxed"
            style={{
              lineHeight: "1.8",
              fontSize: "16px",
            }}
            dangerouslySetInnerHTML={{
              __html: formatContent(content),
            }}
          />
        </div>
      </div>
    </article>
  )
}
