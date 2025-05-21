import type { Metadata } from "next"
import BlogCategories from "@/components/features/docs/blog-categories"
import BlogTimeline from "@/components/features/docs/blog-timeline"
import { CategoryProvider } from "@/components/features/docs/category-provider"

export const metadata: Metadata = {
  title: "博客 | 分类文章",
  description: "浏览不同分类的博客文章",
}

export default function BlogPage() {
  return (
    <CategoryProvider>
      <main className="mx-auto w-[70%] py-12">
        <BlogCategories />
        <div className="mt-8">
          <BlogTimeline />
        </div>
      </main>
    </CategoryProvider>
  )
}
