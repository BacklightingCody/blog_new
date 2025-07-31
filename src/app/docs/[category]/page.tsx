
import BlogList from "@/components/features/docs/blog-list"
import BlogTimeline from "@/components/features/docs/blog-timeline"
import BreadcrumbNav from "@/components/features/docs/breadcrumb"
import { Home } from "lucide-react"
import { categoryNameMap } from "@/constants/index"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const {category} = await params
  const pageTitle = categoryNameMap[category as keyof typeof categoryNameMap] || category
  return {
    title: `${pageTitle} 文档 - 我的网站`,
    description: `浏览关于 ${pageTitle} 的文档和文章`,
  }
}

export default async function CategoryDocPage({ params }: { params: Promise<{ category: string }> }) {
  const {category} = await params
  const categoryName = categoryNameMap[category as keyof typeof categoryNameMap] || category

  const breadcrumbItems = [
    { label: "首页", href: "/", icon: <Home className="h-4 w-4" /> },
    { label: "文稿", href: "/docs" },
    { label: categoryName },
  ]

  return (
    <div className="mx-auto w-[70%] py-12">
      <BreadcrumbNav items={breadcrumbItems} />

      <div className="mt-8">
        <h1 className="text-3xl font-bold mb-6">{categoryName} 文章</h1>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">列表视图</TabsTrigger>
            <TabsTrigger value="timeline">时间线视图</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-6">
            <BlogList category={category} />
          </TabsContent>

          <TabsContent value="timeline" className="mt-6">
            <BlogTimeline category={category} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
