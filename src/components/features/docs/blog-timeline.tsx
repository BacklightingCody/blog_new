"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { Article, getArticlesByCategory } from "@mock/docs"
import { cn } from "@/lib/utils"
import { ArticleLink } from "./article-link"

interface BlogTimelineProps {
  category: string
}

export default function BlogTimeline({ category }: BlogTimelineProps) {
  const [hoveredArticle, setHoveredArticle] = useState<number | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const articles = getArticlesByCategory(category)

  // 获取所有标签
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    articles.forEach(article => {
      article.tags.forEach(tag => tags.add(tag))
    })
    return Array.from(tags)
  }, [articles])

  // 根据选中的标签筛选文章
  const filteredArticles = useMemo(() => {
    if (!selectedTag) return articles
    return articles.filter(article => article.tags.includes(selectedTag))
  }, [articles, selectedTag])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "MM/dd/yyyy", { locale: zhCN })
  }

  return (
    <div className="space-y-8">
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
                    <time className="text-sm text-muted-foreground">{formatDate(article.date)}</time>
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
