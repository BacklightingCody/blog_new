"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { Clock, Eye, MessageSquare, ThumbsUp, Tag, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArticlesApi } from "@/lib/api/articles"
import type { Article, ArticleQueryParams } from "@/types/article"
import { formatArticleDate, formatReadTime, getAuthorDisplayName } from "@/utils/article-transform"
import TimeStats from './time-stats'
import { ArticleLink } from "./article-link"

interface BlogListProps {
  category?: string;
  limit?: number;
  showPagination?: boolean;
}

export default function BlogList({ category, limit, showPagination = true }: BlogListProps = {}) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [total, setTotal] = useState(0)
  const observerRef = useRef<HTMLDivElement>(null)

  // 加载文章
  const loadArticles = async (pageNum: number = 1, append: boolean = false) => {
    if (loading) return

    setLoading(true)
    setError(null)

    try {
      const params: ArticleQueryParams = {
        page: pageNum,
        limit: limit || 10,
        isPublished: true,
        isDraft: false,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      }

      if (category) {
        params.category = category
      }

      const response = await ArticlesApi.getArticles(params)

      if (response.success && response.data) {
        const { data: newArticles, pagination } = response.data

        if (append) {
          setArticles(prev => [...prev, ...newArticles])
        } else {
          setArticles(newArticles)
        }

        setHasMore(pagination.hasNext)
        setTotal(pagination.total)
        setPage(pageNum)
      } else {
        setError(response.error || '加载文章失败')
      }
    } catch (err) {
      setError('网络错误，请稍后重试')
      console.error('Failed to load articles:', err)
    } finally {
      setLoading(false)
    }
  }

  // 加载更多文章
  const loadMoreArticles = () => {
    if (hasMore && !loading) {
      loadArticles(page + 1, true)
    }
  }

  // 设置无限滚动
  useEffect(() => {
    if (!showPagination) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
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
  }, [loading, hasMore, page, showPagination])

  // 初始加载
  useEffect(() => {
    loadArticles(1, false)
  }, [category, limit])

  if (error) {
    return (
      <div className="space-y-4">
        <TimeStats />
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => loadArticles(1, false)}
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
      <TimeStats />

      {/* 文章统计 */}
      {total > 0 && (
        <div className="text-sm text-muted-foreground mb-4">
          共找到 {total} 篇文章
        </div>
      )}

      <div className="space-y-0">
        {articles.map((article) => (
          <ArticleItem key={`${article.slug}-${article.id}`} article={article} />
        ))}
      </div>

      {/* 加载更多 */}
      {showPagination && (
        <div ref={observerRef} className="py-4 text-center">
          {loading && <p className="text-muted-foreground">加载更多文章...</p>}
          {!hasMore && articles.length > 0 && (
            <p className="text-muted-foreground">已加载全部文章</p>
          )}
        </div>
      )}

      {/* 空状态 */}
      {!loading && articles.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">暂无文章</p>
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

        {/* 统计信息 */}
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
      </div>
    </motion.div>
  )
}
