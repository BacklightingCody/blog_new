import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getDatabaseArticleById } from '@/lib/api/database';
import { ArticlePage } from '@/components/features/docs';
import { categoryNameMap } from '@/constants/index';

interface PageProps {
  params: {
    category: string;
    id: string;
  };
  searchParams?: {
    useDatabase?: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { category, id } = await params;
    const categoryName = categoryNameMap[category as keyof typeof categoryNameMap];
    
    if (!categoryName) {
      return { title: '分类不存在', description: '请求的分类不存在' }
    }
    
    const article = await getDatabaseArticleById(id, true); // 启用数据库查询
    
    if (!article) {
      return { title: '文章未找到', description: '请求的文章不存在' }
    }
    
    // 验证文章是否属于当前分类
    if (article.category !== category) {
      return { title: '文章分类不匹配', description: '文章不属于当前分类' }
    }
    
    return {
      title: article.title,
      description: article.summary || article.content.substring(0, 160),
      keywords: article.articleTags.map(x => x.tag.name).join(', '),
      authors: [{ name: `${article.user.firstName || ''} ${article.user.lastName || ''}`.trim() }],
      openGraph: {
        title: article.title,
        description: article.summary || article.content.substring(0, 160),
        type: 'article',
        publishedTime: article.createdAt,
        modifiedTime: article.updatedAt,
        authors: [`${article.user.firstName || ''} ${article.user.lastName || ''}`.trim()],
        tags: article.articleTags.map(x => x.tag.name),
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

export default async function CategoryArticleDetailPage({ params }: PageProps) {
  try {
    const { category, id } = await params;
    const categoryName = categoryNameMap[category as keyof typeof categoryNameMap];
    
    // 检查分类是否存在
    if (!categoryName) {
      notFound();
    }
    
    if (!id) notFound();

    const article = await getDatabaseArticleById(id, true); // 启用数据库查询
    if (!article) notFound();
    
    // 验证文章是否属于当前分类
    if (article.category !== category) {
      notFound();
    }

    const relatedArticles = await getRelatedArticles(article);

    return (
      <ArticlePage 
        article={article} 
        relatedArticles={relatedArticles}
      />
    );
  } catch (error) {
    console.error('Error loading article:', error);
    notFound();
  }
}