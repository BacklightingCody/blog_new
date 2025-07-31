"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { ArticlesApi } from "@/lib/api/articles"
import type { Article, ArticleQueryParams } from "@/types/article"
import { cn } from "@/lib/utils"
import { ArticleLink } from "./article-link"

interface BlogTimelineProps {
  category: string
}

export default function BlogTimeline({ category }: BlogTimelineProps) {
  const [hoveredArticle, setHoveredArticle] = useState<number | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 加载文章数据
  const loadArticles = async () => {
    setLoading(true)
    setError(null)

    try {
      const params: ArticleQueryParams = {
        category,
        isPublished: true,
        isDraft: false,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        limit: 100, // 获取所有文章用于时间线展示
      }

      const response = await ArticlesApi.getArticles(params)

      if (response.success && response.data) {
        setArticles(response.data.data)
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

  // 获取所有标签
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    articles.forEach(article => {
      article.articleTags.forEach(articleTag => tags.add(articleTag.tag.name))
    })
    return Array.from(tags)
  }, [articles])

  // 根据选中的标签筛选文章
  const filteredArticles = useMemo(() => {
    if (!selectedTag) return articles
    return articles.filter(article =>
      article.articleTags.some(articleTag => articleTag.tag.name === selectedTag)
    )
  }, [articles, selectedTag])

  // 初始加载
  useEffect(() => {
    loadArticles()
  }, [category])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "MM/dd/yyyy", { locale: zhCN })
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center py-8">
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={loadArticles}
            className="px-4 py-2 bg-theme-primary text-white rounded hover:bg-theme-primary/80 transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* 文章统计 */}
      <div className="text-sm text-muted-foreground">
        共找到 {articles.length} 篇文章
      </div>

      {/* 标签选择器 */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedTag(null)}
          className={cn(
            "relative rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-theme-primary cursor-pointer",
            selectedTag === null ? "bg-theme-primary" : "bg-muted/40"
          )}
        >
          全部
          {selectedTag === null && (
            <motion.div
              layoutId="activeTagBg"
              className="absolute inset-0 rounded-full bg-theme-primary"
              style={{ zIndex: -1 }}
              initial={false}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={cn(
              "relative rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-theme-primary cursor-pointer",
              selectedTag === tag ? "bg-theme-primary" : "bg-muted/40"
            )}
          >
            {tag}
            {selectedTag === tag && (
              <motion.div
                layoutId="activeTagBg"
                className="absolute inset-0 rounded-full bg-theme-primary"
                style={{ zIndex: -1 }}
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* 文章时间线 */}
      <div className="relative">
        <div className="absolute left-2 top-0 h-full w-[2px] bg-theme-primary/30" />
        <AnimatePresence mode="wait">
          <ul className="space-y-6">
            {filteredArticles.map((article) => (
              <motion.li
                key={`${article.category}-${article.id}`}
                className="relative pl-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute left-[2px] top-1.5 h-[14px] w-[14px] rounded-full border-1 bg-theme-secondary" />
                <div
                  className="group block"
                  onMouseEnter={() => setHoveredArticle(article.id)}
                  onMouseLeave={() => setHoveredArticle(null)}
                >
                  <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                    <h3 className="relative text-lg font-medium transition-colors group-hover:text-theme-primary">
                      <ArticleLink article={article}>
                        {article.title}
                      </ArticleLink>
                      <div className="relative">
                        {hoveredArticle === article.id && (
                          <motion.div
                            className="absolute -bottom-1 left-0 h-[2px] w-full bg-theme-primary"
                            initial={{ width: 0, left: 0, right: "100%" }}
                            animate={{ width: "100%", left: 0, right: 0 }}
                            exit={{ width: 0, left: "100%", right: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          />
                        )}
                      </div>
                    </h3>
                    <time className="text-sm text-muted-foreground">{formatDate(article.createdAt)}</time>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        </AnimatePresence>
      </div>
    </div>
  )
}
