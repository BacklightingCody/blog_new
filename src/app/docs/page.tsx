import type { Metadata } from "next"
import BlogList from "@/components/features/docs/blog-list"

export const metadata: Metadata = {
  title: "文档 - 我的网站",
  description: "浏览所有文档和文章",
}

export default function DocsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">所有文章</h1>
      <BlogList />
    </div>
  )
}
