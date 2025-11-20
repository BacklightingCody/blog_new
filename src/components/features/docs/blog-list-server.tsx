"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { Clock, Eye, MessageSquare, ThumbsUp, Tag, User, Share2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Article } from "@/types/article"
import { formatArticleDate, formatReadTime, getAuthorDisplayName } from "@/utils/article-transform"
import { ArticleLink } from "./article-link"
import { ShareDialog } from "./share-dialog"
import { useRouter, useSearchParams } from "next/navigation"

interface BlogListServerProps {
  initialArticles: Article[];
  initialPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  search?: string;
}

export default function BlogListServer({ 
  initialArticles, 
  initialPagination,
  search 
}: BlogListServerProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState(initialPagination)
  const observerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  // 加载更多文章
  const loadMoreArticles = async () => {
    if (loading || pagination.page >= pagination.totalPages) return

    setLoading(true)
    setError(null)

    try {
      const nextPage = pagination.page + 1
      const params = new URLSearchParams(searchParams)
      params.set('page', nextPage.toString())
      if (search) params.set('search', search)

      const res = await fetch(`/api/articles?${params.toString()}`)
      const json = await res.json()
      
      if (!json?.success) throw new Error(json?.error || '加载失败')
      
      const newArticles: Article[] = json.data?.articles || []
      const newPagination = json.data?.pagination || pagination

      setArticles(prev => [...prev, ...newArticles])
      setPagination(newPagination)
    } catch (err) {
      setError('加载文章失败')
      console.error('Failed to load articles:', err)
    } finally {
      setLoading(false)
    }
  }

  // 设置无限滚动
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && pagination.page < pagination.totalPages && !loading) {
          loadMoreArticles()
        }
      },
      { threshold: 0.1 },
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current)
      }
    }
  }, [loading, pagination.page, pagination.totalPages])

  if (error) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-theme-primary text-white rounded hover:bg-theme-primary/80 transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* 文章统计 */}
      {pagination.total > 0 && (
        <div className="text-sm text-muted-foreground mb-4">
          共找到 {pagination.total} 篇文章
          {search && <span> - 搜索关键词: "{search}"</span>}
        </div>
      )}

      <div className="space-y-0">
        {articles.map((article) => (
          <ArticleItem key={`${article.slug}-${article.id}`} article={article} />
        ))}
      </div>

      {/* 加载更多 */}
      <div ref={observerRef} className="py-4 text-center">
        {loading && <p className="text-muted-foreground">加载更多文章...</p>}
        {pagination.page >= pagination.totalPages && articles.length > 0 && (
          <p className="text-muted-foreground">已加载全部文章</p>
        )}
      </div>

      {/* 空状态 */}
      {!loading && articles.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {search ? `没有找到包含 "${search}" 的文章` : "暂无文章"}
          </p>
        </div>
      )}
    </div>
  )
}

function ArticleItem({ article }: { article: Article }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const controls = useAnimation()
  const [isHovered, setIsHovered] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
      }}
      className="relative overflow-hidden rounded-lg py-5 px-6 my-5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ x: -8, transition: { duration: 0.2 } }}
    >
      {/* 背景滑块效果 */}
      <motion.div
        className="absolute inset-0 bg-theme-primary/10 rounded-lg"
        initial={{ x: "-100%" }}
        animate={{ x: isHovered ? "0%" : "-100%" }}
        transition={{ type: "tween", duration: 0.3 }}
      />

      <div className="relative">
        <div className="my-3">
          <div className="relative inline-block">
            <ArticleLink article={article} className="text-xl font-medium hover:text-primary transition-colors">
              {article.title}
            </ArticleLink>

            {/* 标题下划线动画 */}
            <motion.div
              className="absolute bottom-0 left-0 h-[2px] bg-theme-primary"
              initial={{ width: 0, left: 0 }}
              animate={{
                width: isHovered ? "100%" : 0,
                left: isHovered ? 0 : "100%",
              }}
              transition={{
                type: "tween",
                duration: 0.3,
                ease: "easeInOut",
              }}
            />
          </div>
        </div>

        {/* 文章摘要 */}
        {article.summary && (
          <div className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {article.summary}
          </div>
        )}

        {/* 作者和时间信息 */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
          <div className="flex items-center">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src={article.user.imageUrl || undefined} alt={getAuthorDisplayName(article.user)} />
              <AvatarFallback>
                <User className="h-3 w-3" />
              </AvatarFallback>
            </Avatar>
            <span>{getAuthorDisplayName(article.user)}</span>
          </div>

          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            <span>{formatArticleDate(article.createdAt)}</span>
          </div>

          {article.readTime && (
            <div className="flex items-center">
              <span>{formatReadTime(article.readTime)}</span>
            </div>
          )}
        </div>

        {/* 分类和标签 */}
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="default">
            {article.category}
          </Badge>

          {article.articleTags.map((articleTag) => (
            <Badge
              key={articleTag.tag.id}
              variant="outline"
              style={{
                borderColor: articleTag.tag.color || undefined,
                color: articleTag.tag.color || undefined
              }}
            >
              <Tag className="mr-1 h-3 w-3" />
              {articleTag.tag.name}
            </Badge>
          ))}
        </div>

        {/* 统计信息和操作按钮 */}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Eye className="mr-1 h-4 w-4" />
              <span>{article.viewCount}</span>
            </div>

            <div className="flex items-center">
              <ThumbsUp className="mr-1 h-4 w-4" />
              <span>{article.likes}</span>
            </div>

            <div className="flex items-center">
              <MessageSquare className="mr-1 h-4 w-4" />
              <span>{article.comments}</span>
            </div>
          </div>

          {/* 快速分享按钮 */}
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              setShowShareDialog(true);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 分享对话框 */}
      {showShareDialog && (
        <ShareDialog 
          article={article} 
          onClose={() => setShowShareDialog(false)} 
        />
      )}
    </motion.div>
  )
}
