'use client'
import { ArticleDetail } from "@/components/features/docs/article-detial"
import { ArticleActions } from "@/components/features/docs/article-actions"
import { CommentSection } from "@/components/features/docs/comment-section"
import { useState } from "react"
import BreadcrumbNav from "@/components/features/docs/breadcrumb"
import { Home } from "lucide-react"
import type { Article } from '@/types/article'
import { ArticlesApi } from "@/lib/api/articles"
import { categoryNameMap } from "@/constants/index"

interface ArticlePageProps {
  article: Article
}

export default function ArticlePage({ article }: ArticlePageProps) {
  const [likes, setLikes] = useState(article.likes)
  const [bookmarks, setBookmarks] = useState(article.bookmarks)
  const [comments, setComments] = useState(article.messages || [])
  const [isLiking, setIsLiking] = useState(false)
  const [isBookmarking, setIsBookmarking] = useState(false)

  const breadcrumbItems = [
    { label: "首页", href: "/", icon: <Home className="h-4 w-4" /> },
    { label: "文稿", href: "/docs" },
    { label: categoryNameMap[article.category as keyof typeof categoryNameMap] || article.category, href: `/docs/${article.category}` },
    { label: article.title },
  ]

  const handleLike = async () => {
    if (isLiking) return

    setIsLiking(true)
    try {
      const response = await ArticlesApi.likeArticle(article.id)
      if (response.success && response.data) {
        setLikes(response.data.likes)
      } else {
        // 如果API调用失败，回退到本地状态更新
        setLikes((prev) => prev + 1)
      }
    } catch (error) {
      console.error('Failed to like article:', error)
      setLikes((prev) => prev + 1)
    } finally {
      setIsLiking(false)
    }
  }

  const handleBookmark = async () => {
    if (isBookmarking) return

    setIsBookmarking(true)
    try {
      const response = await ArticlesApi.bookmarkArticle(article.id)
      if (response.success && response.data) {
        setBookmarks(response.data.bookmarks)
      } else {
        // 如果API调用失败，回退到本地状态更新
        setBookmarks((prev) => prev + 1)
      }
    } catch (error) {
      console.error('Failed to bookmark article:', error)
      setBookmarks((prev) => prev + 1)
    } finally {
      setIsBookmarking(false)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary || '',
        url: window.location.href,
      })
    } else {
      // 回退到复制链接
      navigator.clipboard.writeText(window.location.href)
      console.log("链接已复制到剪贴板")
    }
  }

  const handleAddComment = (content: string) => {
    // TODO: 实现评论功能，需要后端支持
    const newComment = {
      id: Date.now(),
      content,
      user: {
        id: 1,
        username: "当前用户",
        firstName: null,
        lastName: null,
        imageUrl: null,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setComments((prev) => [...prev, newComment])
  }

  const handleLikeComment = (commentId: number) => {
    // TODO: 实现评论点赞功能，需要后端支持
    console.log("点赞评论:", commentId)
  }

  return (
    <main className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <BreadcrumbNav items={breadcrumbItems} />
        <div className="space-y-0">
          <ArticleDetail article={article} />
          <ArticleActions
            likes={likes}
            bookmarks={bookmarks}
            comments={comments.length}
            onLike={handleLike}
            onBookmark={handleBookmark}
            onShare={handleShare}
            isLiking={isLiking}
            isBookmarking={isBookmarking}
          />
          <CommentSection comments={comments} onAddComment={handleAddComment} onLikeComment={handleLikeComment} />
        </div>
      </div>
    </main>
  )
}