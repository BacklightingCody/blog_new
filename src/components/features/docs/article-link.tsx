"use client"

import Link from "next/link"
import type { Article } from "@/types/article"

interface ArticleLinkProps {
  article: Article
  className?: string
  children: React.ReactNode
}

export function ArticleLink({ article, className = "", children }: ArticleLinkProps) {
  const href = `/docs/${article.category}/${article.slug}`

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}