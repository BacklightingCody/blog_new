import type { Metadata } from "next"
import BlogTimeline from "@/components/features/docs/blog-timeline"
import BreadcrumbNav from "@/components/features/docs/breadcrumb"

export async function generateMetadata({ params }: { params: { category: string } }) {
  const category = params.category
  const pageTitle = category.charAt(0).toUpperCase() + category.slice(1)
  return {
    title: `${pageTitle} 文档 - 我的网站`,
    description: `浏览关于 ${pageTitle} 的文档和文章`,
  }
}

export default function CategoryDocPage({ params }: { params: { category: string } }) {
  const category = params.category
  return (
    <div className="mx-auto w-[70%] py-12">
      <BreadcrumbNav category={category} />
      <BlogTimeline category={category} />
    </div>
  )
}
