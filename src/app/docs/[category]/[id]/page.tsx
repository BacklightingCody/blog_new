import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ArticleDetailClient from '../../../../components/features/docs/article-detail-client';

interface PageProps {
  params: {
    category: string;
    id: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { id } = params;
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/articles/slug/${id}`, { cache: 'no-store' })
    const json = await res.json()
    const article = json?.data
    if (!article) {
      return { title: '文章未找到', description: '请求的文章不存在' }
    }
    return {
      title: `${article.title}`,
      description: article.summary || article.content.substring(0, 160),
      keywords: article.articleTags.map((x: any) => x.tag.name).join(', '),
      authors: [{ name: `${article.user.firstName || ''} ${article.user.lastName || ''}`.trim() }],
      openGraph: {
        title: article.title,
        description: article.summary || article.content.substring(0, 160),
        type: 'article',
        publishedTime: article.createdAt,
        modifiedTime: article.updatedAt,
        authors: [`${article.user.firstName || ''} ${article.user.lastName || ''}`.trim()],
        tags: article.articleTags.map((x: any) => x.tag.name),
        images: article.coverImage ? [{ url: article.coverImage, width: 1200, height: 630, alt: article.title }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.summary || article.content.substring(0, 160),
        images: article.coverImage ? [article.coverImage] : undefined,
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
    return { title: '文章加载失败', description: '无法加载文章信息' }
  }
}

export default async function ArticleDetailPage({ params }: PageProps) {
  try {
    const { category, id } = params;
    if (!id) notFound()
    return <ArticleDetailClient category={category} slug={id} />
  } catch (error) {
    console.error('Error loading article:', error);
    notFound();
  }
}