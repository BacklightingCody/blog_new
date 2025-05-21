"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { Clock, Eye, MessageSquare, ThumbsUp, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Article, getAllArticles } from "@mock/docs"
import TimeStats from './time-stats'
export default function BlogList() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const observerRef = useRef<HTMLDivElement>(null)

  // 加载文章
  const loadArticles = async () => {
    if (loading) return

    setLoading(true)
    // 模拟API请求延迟
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const initialArticles = getAllArticles()
    const newArticles = [...initialArticles].map((article) => ({
      ...article,
      id: article.id + page * initialArticles.length,
    }))

    setArticles((prev) => [...prev, ...newArticles])
    setPage((prev) => prev + 1)
    setLoading(false)
  }

  // 设置无限滚动
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadArticles()
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
  }, [loading])

  // 初始加载
  useEffect(() => {
    loadArticles()
  }, [])

  return (
    <div className="space-y-4">
      <TimeStats />
      <div className="space-y-0">
        {articles.map((article) => (
          <ArticleItem key={article.id} article={article} />
        ))}
      </div>

      <div ref={observerRef} className="py-4 text-center">
        {loading && <p className="text-muted-foreground">加载更多文章...</p>}
      </div>
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
            <a href={`/blog/${article.slug}`} className="text-xl font-medium hover:text-primary transition-colors">
              {article.title}
            </a>

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

        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground my-3">
          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            <span>{article.date}</span>
          </div>

          <div className="flex items-center">
            <Badge variant="secondary" className="mr-1">
              {article.category}
            </Badge>

            {article.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="mr-1">
                <Tag className="mr-1 h-3 w-3" />
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Eye className="mr-1 h-4 w-4" />
            <span>{article.views}</span>
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
