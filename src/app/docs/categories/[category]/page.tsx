import type { Metadata } from "next"
import { getServerDatabaseArticlesByCategory, getServerDatabaseCategories } from "@/lib/api/database"
import { BlogListServer, TimeStats } from "@/components/features/docs"
import { notFound } from "next/navigation"

interface CategoryPageProps {
  params: { category: string }
  searchParams: { page?: string; search?: string; useDatabase?: string }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categoryName = decodeURIComponent(params.category)
  
  return {
    title: `${categoryName} - 文档分类`,
    description: `浏览 ${categoryName} 分类下的所有文档`,
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const categoryName = decodeURIComponent(params.category)
  const awaitedSearchParams = await searchParams
  const page = parseInt(awaitedSearchParams?.page || '1')
  const search = awaitedSearchParams?.search
  const useDatabase = awaitedSearchParams?.useDatabase !== 'false'

  try {
    // 验证分类是否存在
    const categoriesResponse = await getServerDatabaseCategories(useDatabase)
    const categoryExists = categoriesResponse.categories.some(
      cat => cat.name === categoryName || cat.id === categoryName
    )

    if (!categoryExists) {
      notFound()
    }

    // 获取分类文章
    const { articles, pagination } = await getServerDatabaseArticlesByCategory(categoryName, {
      page,
      limit: 10,
      useDatabase
    })

    // 转换docs格式为articles格式以兼容现有组件
    // 现在直接使用数据库集成API返回的Article格式

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <nav className="text-sm text-gray-500 mb-4">
            <a href="/docs" className="hover:text-gray-700">文档</a>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{categoryName}</span>
          </nav>
          <h1 className="text-3xl font-bold">{categoryName}</h1>
          <p className="text-gray-600 mt-2">共 {pagination.total} 篇文档</p>
        </div>
        
        <div className="space-y-4">
          <TimeStats />
          <BlogListServer 
            initialArticles={articles}
            initialPagination={pagination}
            search={search}
          />
        </div>
      </div>
    )
  } catch (error) {
    console.error('获取分类文档失败:', error)
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">{categoryName}</h1>
        <div className="text-center py-8">
          <p className="text-red-500">加载分类文档失败，请稍后重试</p>
          <p className="text-sm text-gray-500 mt-2">
            错误信息: {error instanceof Error ? error.message : '未知错误'}
          </p>
        </div>
      </div>
    )
  }
}

// 生成静态路径
export async function generateStaticParams() {
  try {
    const response = await getServerDatabaseCategories()
    return response.categories.map((category) => ({
      category: encodeURIComponent(category.name),
    }))
  } catch (error) {
    console.error('生成静态路径失败:', error)
    return []
  }
}