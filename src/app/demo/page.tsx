"use client"

import { PreviewCard } from "@/components/features/card/PreviewCard"
import { CustomCardContent } from "@/components/features/card/CardContent"
import { demos, type DemoItem } from '@/mock/demo'
import { useCoverImage } from '@/hooks/useCoverImage';
import { DEFAULT_COVER_IMAGE_NAMES } from '@/constants/defaultCover';
import { useMemo, useState, useEffect } from 'react';
import Image from 'next/image';

// 使用 Intersection Observer 实现懒加载
const useIntersectionObserver = (callback: () => void) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callback();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('demo-grid');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect(); 
  }, [callback]);
};

export default function DemoPage() {
  const [isVisible, setIsVisible] = useState(false);
  const getCoverPath = useCoverImage(DEFAULT_COVER_IMAGE_NAMES);
  const randomCoverImage = useMemo(() => getCoverPath(), []);

  // 使用 Intersection Observer 检测元素是否可见
  useIntersectionObserver(() => { 
    setIsVisible(true);
  });

  const { uniqueTagsCount, uniqueTags } = useMemo(() => {
    const tags = Array.from(new Set(demos.flatMap((d: DemoItem) => d.tags || [])));
    return {
      uniqueTagsCount: tags.length,
      uniqueTags: tags
    };
  }, []);

  // 分批加载数据
  const [visibleDemos, setVisibleDemos] = useState<DemoItem[]>(demos.slice(0, 6));
  const [hasMore, setHasMore] = useState(demos.length > 6);

  const loadMore = () => {
    const currentLength = visibleDemos.length;
    const nextBatch = demos.slice(currentLength, currentLength + 6);
    setVisibleDemos((prev: DemoItem[]) => [...prev, ...nextBatch]);
    setHasMore(currentLength + 6 < demos.length);
  };

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
        {uniqueTags.map((tag: string) => (
          <span
            key={tag}
            className="px-3 py-1 bg-secondary rounded-full text-sm hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Demo Grid */}
      <div id="demo-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isVisible && visibleDemos.map((demo: DemoItem) => (
          <PreviewCard
            key={demo.id}
            coverImage={demo.coverImage || randomCoverImage}
            previewUrl={demo.href}
            href={demo.href}
            coverAlt={demo.title}
            previewTitle={demo.title}
          >
            <CustomCardContent 
              title={demo.title} 
              description={demo.description} 
              date={demo.date} 
              tags={demo.tags || []} 
            />
          </PreviewCard>
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center mt-12">
          <button 
            onClick={loadMore}
            className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors text-sm font-medium"
          >
            加载更多 Demo
          </button>
        </div>
      )}
    </div>
  )
}
