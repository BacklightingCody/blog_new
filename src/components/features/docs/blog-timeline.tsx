"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import Link from "next/link"
import { useCategory } from "@/components/features/docs/category-provider"

// 博客文章数据
const articles = [
  {
    id: 1,
    title: "虚拟列表中的选区操作",
    date: "2024-04-15",
    category: "programming",
    slug: "virtual-list-selection",
  },
  {
    id: 2,
    title: "Server Action & Streamable UI",
    date: "2024-03-06",
    category: "nextjs",
    slug: "server-action-streamable-ui",
  },
  {
    id: 3,
    title: "关于React Native的WebView编辑器问题记录",
    date: "2024-01-19",
    category: "react",
    slug: "react-native-webview-editor-issues",
  },
  {
    id: 4,
    title: "超级组合！NestJS + tRPC 与CSR绝佳搭档React Query，开启全新开发时代！",
    date: "2023-09-25",
    category: "programming",
    slug: "nestjs-trpc-react-query",
  },
  {
    id: 5,
    title: "Next.js 13 App Router 迁移计划",
    date: "2023-05-11",
    category: "nextjs",
    slug: "nextjs-13-app-router-migration",
  },
  {
    id: 6,
    title: "让Tailwind内置颜色支持暗黑模式",
    date: "2023-04-14",
    category: "design",
    slug: "tailwind-dark-mode-colors",
  },
  {
    id: 7,
    title: "一个更好用的Bump Version",
    date: "2023-01-05",
    category: "programming",
    slug: "better-bump-version",
  },
  {
    id: 8,
    title: "Kami 抽取通用组件封装公用组件库",
    date: "2022-12-14",
    category: "design",
    slug: "kami-component-library",
  },
  {
    id: 9,
    title: "CSS文本溢出Clip不截切半个字符",
    date: "2022-10-15",
    category: "design",
    slug: "css-text-overflow-clip",
  },
  {
    id: 10,
    title: "在2022年，写一个库有多难",
    date: "2022-09-18",
    category: "programming",
    slug: "writing-library-in-2022",
  },
  {
    id: 11,
    title: "NestJS服务端推送日志流输出",
    date: "2022-07-10",
    category: "programming",
    slug: "nestjs-server-sent-events-logs",
  },
  {
    id: 12,
    title: "NextJS首屏加载优化",
    date: "2022-06-24",
    category: "nextjs",
    slug: "nextjs-first-load-optimization",
  },
]

export default function BlogTimeline() {
  const [hoveredArticle, setHoveredArticle] = useState<number | null>(null)
  const { activeCategory } = useCategory()

  const filteredArticles =
    activeCategory === "all" ? articles : articles.filter((article) => article.category === activeCategory)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "MM/dd/yyyy", { locale: zhCN })
  }

  return (
    <div className="relative">
      <div className="absolute left-[14px] top-0 h-full w-[2px] bg-theme-primary/30" />
      <AnimatePresence mode="wait">
        <ul className="space-y-6">
          {filteredArticles.map((article) => (
            <motion.li
              key={article.id}
              className="relative pl-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full border-1 bg-theme-secondary" />
              <Link
                href={`/blog/${article.slug}`}
                className="group block"
                onMouseEnter={() => setHoveredArticle(article.id)}
                onMouseLeave={() => setHoveredArticle(null)}
              >
                <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                  <h3 className="relative text-lg font-medium transition-colors group-hover:text-theme-primary">
                    {article.title}
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
              </Link>
            </motion.li>
          ))}
        </ul>
      </AnimatePresence>
    </div>
  )
}
