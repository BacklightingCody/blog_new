import type { Metadata } from "next"
import { getServerDatabaseArticles, getServerDatabaseCategories } from "@/lib/api/database"
import { BlogListServer, TimeStats } from "@/components/features/docs"
import Link from "next/link"

export const metadata: Metadata = {
  title: "文档 - 我的网站",
  description: "浏览所有文档和文章",
}

export default async function DocsPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; useDatabase?: string }
}) {
  const awaitedSearchParams = await searchParams
  console.log('searchParams:', awaitedSearchParams);
  const page = parseInt(awaitedSearchParams?.page || '1');
  const search = awaitedSearchParams?.search;
  const useDatabase = awaitedSearchParams?.useDatabase !== 'false';

  try {
    const [{ articles, pagination }, categoriesResponse] = await Promise.all([
      getServerDatabaseArticles({
        // page,
        // limit: 10,
        search,
        useDatabase
      }),
      getServerDatabaseCategories(useDatabase).catch(() => ({ categories: [] }))
    ]);

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">所有文档</h1>
          
          {/* 分类导航 - 直接链接到分类页面 */}
          {/* {categoriesResponse.categories.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900">文档分类</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {categoriesResponse.categories.slice(0, 8).map((category) => (
                  <Link
                    key={category.id}
                    href={`/docs/categories/${encodeURIComponent(category.name)}`}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    {category.name}
                    <span className="ml-1.5 text-xs text-gray-500">({category.count})</span>
                  </Link>
                ))}
              </div>
            </div>
          )} */}
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
    console.error('获取文档失败:', error);
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">所有文档</h1>
        <div className="text-center py-8">
          <p className="text-red-500">加载文档失败，请稍后重试</p>
          <p className="text-sm text-gray-500 mt-2">错误信息: {error instanceof Error ? error.message : '未知错误'}</p>
        </div>
      </div>
    )
  }
}
