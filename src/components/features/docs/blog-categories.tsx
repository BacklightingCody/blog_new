"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useCategory } from "@/components/features/docs/category-provider"

// 博客分类数据
const categories = [
  { id: "all", name: "全部文章" },
  { id: "ai", name: "人工智能" },
  { id: "programming", name: "编程技术" },
  { id: "nextjs", name: "Next.js" },
  { id: "react", name: "React" },
  { id: "design", name: "设计" },
]

export default function BlogCategories() {
  const { activeCategory, setCategory } = useCategory()

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setCategory(category.id)}
            className={cn(
              "relative rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-theme-primary/10",
              activeCategory === category.id ? "bg-theme-primary text-white" : "bg-muted/40",
            )}
          >
            {category.name}
            {activeCategory === category.id && (
              <motion.div
                layoutId="activeCategoryBg"
                className="absolute inset-0 rounded-full bg-theme-primary"
                style={{ zIndex: -1 }}
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
