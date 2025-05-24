"use client"

import { PreviewCard } from "@/components/features/card/preview-card"
import { CustomCardContent } from "@/components/features/card/card-content"
import { demos } from '@mock/demo'


export default function DemoPage() {
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
          <div className="text-2xl font-bold text-green-600">
            {Array.from(new Set(demos.flatMap((d) => d.tags))).length}
          </div>
          <div className="text-sm text-muted-foreground">标签</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{new Date().getFullYear()}</div>
          <div className="text-sm text-muted-foreground">年份</div>
        </div>
      </div>

      {/* Demo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demos.map((demo) => (
          <PreviewCard
            key={demo.id}
            coverImage={demo.coverImage}
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
        <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium">
          加载更多 Demo
        </button>
      </div>
    </div>
  )
}
