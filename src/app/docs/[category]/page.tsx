import type { Metadata } from "next"
import BlogTimeline from "@/components/features/docs/blog-timeline"
import BreadcrumbNav from "@/components/features/docs/breadcrumb"
import { Home } from "lucide-react"
import { categoryNameMap } from "@/constants/index"


export async function generateMetadata({ params }: { params: { category: string } }) {
  const category = params.category
  const pageTitle = categoryNameMap[category as keyof typeof categoryNameMap] || category
  return {
    title: `${pageTitle} 文档 - 我的网站`,
    description: `浏览关于 ${pageTitle} 的文档和文章`,
  }
}

export default function CategoryDocPage({ params }: { params: { category: string } }) {
  const category = params.category
  const categoryName = categoryNameMap[category as keyof typeof categoryNameMap] || category

  const breadcrumbItems = [
    { label: "首页", href: "/", icon: <Home className="h-4 w-4" /> },
    { label: "文稿", href: "/docs" },
    { label: categoryName },
  ]

  return (
    <div className="mx-auto w-[70%] py-12">
      <BreadcrumbNav items={breadcrumbItems} />
      <BlogTimeline category={category} />
    </div>
  )
}
