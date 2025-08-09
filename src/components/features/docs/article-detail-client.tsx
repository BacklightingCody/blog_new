'use client'

import React, { useEffect, useState } from 'react'
import { Article } from '@/types/article'
import { getArticleBySlug, likeArticle, bookmarkArticle, fetchComments, postComment, postReply, likeComment } from '@/services/articles'
import { ArticlePage } from './article-page'

interface ArticleDetailClientProps {
  category: string
  slug: string
}

export default function ArticleDetailClient({ category, slug }: ArticleDetailClientProps) {
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)
    getArticleBySlug(slug)
      .then((res) => {
        if (!mounted) return
        if (res?.success && res?.data) {
          setArticle(res.data)
        } else {
          setError(res?.error || '文章加载失败')
        }
      })
      .catch((e) => setError(e?.message || '文章加载失败'))
      .finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [slug])

  if (loading) {
    return <div className="container mx-auto px-4 py-12">加载中...</div>
  }
  if (error || !article) {
    return <div className="container mx-auto px-4 py-12 text-red-500">{error || '文章不存在'}</div>
  }

  return (
    <ArticlePage article={article} />
  )
}


