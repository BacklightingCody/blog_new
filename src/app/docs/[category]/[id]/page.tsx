import ArticlePage from "@/components/features/docs/article-page"
import { mockArticle } from '@mock/docs/detail'

export default async function Page({ params }: { params: Promise<{ category: string; id: string }> }) {
  const { category, id } = await params
  const article = await mockArticle()
  return <ArticlePage article={article} />
}

