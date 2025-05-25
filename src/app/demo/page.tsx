"use client"

import { PreviewCard } from "@/components/features/card/preview-card"
import { CustomCardContent } from "@/components/features/card/card-content"
import { demos } from '@mock/demo'
import useCoverImage from '@/hooks/useCoverImage';
import { DEFAULT_COVER_IMAGE_NAMES } from '@/constants/default_cover';
import { useMemo } from 'react';

export default function DemoPage() {
  // 使用 useMemo 缓存 getCoverPath 函数
  const getCoverPath = useCoverImage(DEFAULT_COVER_IMAGE_NAMES);
  
  // 使用 useMemo 缓存随机封面图片
  const randomCoverImage = useMemo(() => {
    return getCoverPath();
  }, [getCoverPath]);

  // 使用 useMemo 缓存标签统计和标签列表
  const { uniqueTagsCount, uniqueTags } = useMemo(() => {
    const tags = Array.from(new Set(demos.flatMap((d) => d.tags || [])));
    return {
      uniqueTagsCount: tags.length,
      uniqueTags: tags
    };
  }, [demos]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Demo Showcase</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          探索有趣的动画效果、JavaScript优化技巧和前端实验项目
        </p>
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-8 mb-12">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{demos.length}</div>
          <div className="text-sm text-muted-foreground">Demo 数量</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{uniqueTagsCount}</div>
          <div className="text-sm text-muted-foreground">标签</div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {uniqueTags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-theme-accent rounded-full text-sm hover:bg-theme-primary transition-colors cursor-pointer"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Demo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demos.map((demo) => (
          <PreviewCard
            key={demo.id}
            coverImage={demo.coverImage || randomCoverImage}
            previewUrl={demo.href}
            href={demo.href}
            coverAlt={demo.title}
            previewTitle={demo.title}
          >
            <CustomCardContent title={demo.title} description={demo.description} date={demo.date} tags={demo.tags} />
          </PreviewCard>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-12">
        <button className="px-6 py-3 bg-theme-primary hover:bg-theme-accnt rounded-lg transition-colors text-sm font-medium">
          加载更多 Demo
        </button>
      </div>
    </div>
  )
}
