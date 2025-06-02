"use client"

import { ArticleDetail } from "@/components/features/docs/article-detial"
import { ArticleActions } from "@/components/features/docs/article-actions"
import { CommentSection } from "@/components/features/docs/comment-section"
import { useState } from "react"
import { article } from '@mock/docs/detail'
import { initialComments } from '@mock/docs/comment'
import BreadcrumbNav from "@/components/features/docs/breadcrumb"
import { Home } from "lucide-react"

const categoryNameMap = {
  programming: "编程",
  recipe: "食谱",
  ai: "AI",
}

export default function ArticlePage({ params }: { params: { category: string; id: string } }) {
  const [likes, setLikes] = useState(128)
  const [bookmarks, setBookmarks] = useState(45)
  const [comments, setComments] = useState(initialComments)

  const breadcrumbItems = [
    { label: "首页", href: "/", icon: <Home className="h-4 w-4" /> },
    { label: "文稿", href: "/docs" },
    { label: categoryNameMap[params.category as keyof typeof categoryNameMap] || params.category, href: `/docs/${params.category}` },
    { label: article.title },
  ]

  const handleLike = () => {
    setLikes((prev) => prev + 1)
  }

  const handleBookmark = () => {
    setBookmarks((prev) => prev + 1)
  }

  const handleShare = () => {
    // 实现分享功能
    console.log("分享文章")
  }

  const handleAddComment = (content: string) => {
    const newComment = {
      id: comments.length + 1,
      author: "当前用户",
      avatar: "/avatars/default.png", // 添加默认头像
      content,
      time: "刚刚",
      likes: 0,
    }
    setComments((prev) => [...prev, newComment])
  }

  const handleLikeComment = (commentId: number) => {
    setComments((prev) =>
      prev.map((comment) => (comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment)),
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <BreadcrumbNav items={breadcrumbItems} />

        <div className="space-y-0">
          <ArticleDetail {...article} />

          <ArticleActions
            likes={likes}
            bookmarks={bookmarks}
            comments={comments.length}
            onLike={handleLike}
            onBookmark={handleBookmark}
            onShare={handleShare}
          />

          <CommentSection comments={comments} onAddComment={handleAddComment} onLikeComment={handleLikeComment} />
        </div>
      </div>
    </main>
  )
}