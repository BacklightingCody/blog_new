import ArticlePage from "@/components/features/docs/article-page"
import { ArticlesApi } from "@/lib/api/articles"
import { notFound } from "next/navigation"

export default async function Page({ params }: { params: Promise<{ category: string; id: string }> }) {
  const { category, id } = await params

  try {
    // 尝试通过 slug 获取文章（id 实际上是 slug）
    const response = await ArticlesApi.getArticleBySlug(id)

    if (!response.success || !response.data) {
      notFound()
    }

    const article = response.data

    // 验证文章是否属于正确的分类
    if (article.category !== category) {
      notFound()
    }

    // 验证文章是否已发布
    if (!article.isPublished || article.isDraft) {
      notFound()
    }

    return <ArticlePage article={article} />
  } catch (error) {
    console.error('Failed to load article:', error)
    notFound()
  }
}

