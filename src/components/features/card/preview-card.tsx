"use client"

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface PreviewCardProps {
  /** 卡片封面图片 */
  coverImage: string
  /** 预览页面的URL */
  previewUrl: string
  /** 点击跳转的链接 */
  href: string
  /** 封面图片的alt文本 */
  coverAlt?: string
  /** 预览标题 */
  previewTitle?: string
  /** 自定义内容插槽 */
  children: React.ReactNode
  /** 自定义类名 */
  className?: string
  /** hover时的变换效果 */
  hoverEffect?: boolean
  /** 预览缩放比例 */
  previewScale?: number
}

export function PreviewCard({
  coverImage,
  previewUrl,
  href,
  coverAlt = "Preview",
  previewTitle = "Preview",
  children,
  className = "",
  hoverEffect = true,
  previewScale = 0.3, // 默认缩放比例为 0.3
}: PreviewCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const [shouldLoadIframe, setShouldLoadIframe] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 使用 Intersection Observer 检测卡片是否进入视口
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoadIframe(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '100px', // 提前 100px 开始加载
        threshold: 0.1
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  // 处理 iframe 加载完成
  const handleIframeLoad = () => {
    setIsIframeLoaded(true);
  };

  // 计算缩放容器的样式
  const scaleContainerStyle = {
    transform: `scale(${previewScale})`,
    transformOrigin: 'top left',
    width: `${100 / previewScale}%`,
    height: `${100 / previewScale}%`,
  };

  return (
    <div
      ref={cardRef}
      className={`group relative rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
        hoverEffect ? "hover:shadow-lg" : ""
      } ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 封面图片容器 */}
      <div className="relative aspect-video">
        {/* 封面图片 */}
        <div className={cn(
          "absolute inset-0 transition-opacity duration-300",
          isHovered && isIframeLoaded ? "opacity-0" : "opacity-100"
        )}>
          <Image
            src={coverImage || "/cover/default_cover_01.jpg"}
            alt={coverAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* iframe 预览 */}
        {shouldLoadIframe && (
          <div className={cn(
            "absolute inset-0 transition-opacity duration-300 overflow-hidden",
            isHovered && isIframeLoaded ? "opacity-100" : "opacity-0"
          )}>
            <div style={scaleContainerStyle}>
              <iframe
                ref={iframeRef}
                src={previewUrl}
                className="w-full h-full"
                onLoad={handleIframeLoad}
                title={previewTitle}
              />
            </div>
          </div>
        )}

        {/* 加载指示器 */}
        {isHovered && !isIframeLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* 卡片内容 */}
      <div className="p-4">
        {children}
      </div>

      {/* 链接覆盖层 */}
      <Link
        href={href}
        className="absolute inset-0 z-10"
        aria-label={`查看 ${previewTitle} 的详细信息`}
      />
    </div>
  );
}
