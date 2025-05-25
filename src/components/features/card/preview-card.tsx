"use client"

import { Card } from "@/components/ui/card"
import { Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, type ReactNode } from "react"

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
  /** 是否启用iframe预览 */
  enablePreview?: boolean
  /** 预览延迟时间(ms) */
  previewDelay?: number
  /** 预览缩放比例 */
  previewScale?: number
  /** 自定义内容插槽 */
  children: ReactNode
  /** 自定义类名 */
  className?: string
  /** hover时的变换效果 */
  hoverEffect?: boolean
}

export function PreviewCard({
  coverImage,
  previewUrl,
  href,
  coverAlt = "Preview",
  previewTitle = "Preview",
  enablePreview = true,
  previewDelay = 200,
  previewScale = 0.3,
  children,
  className = "",
  hoverEffect = true,
}: PreviewCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [iframeLoaded, setIframeLoaded] = useState(false)

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (enablePreview) {
      setTimeout(() => setShowPreview(true), previewDelay)
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setShowPreview(false)
  }

  const scaleContainer = {
    transform: `scale(${previewScale})`,
    width: `${100 / previewScale}%`,
    height: `${100 / previewScale}%`,
  }

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-300 ${
        hoverEffect ? "hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1" : ""
      } ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative overflow-hidden">
        <div className="aspect-[7/4] relative">
          <Image
            src={coverImage || "/cover/default_cover_01.jpg"}
            alt={coverAlt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Preview overlay with iframe */}
          {enablePreview && (
            <div
              className={`absolute inset-0 bg-black/90 transition-opacity duration-300 ${
                showPreview ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <div className="absolute inset-4 bg-white rounded-lg overflow-hidden shadow-2xl">
                <div className="relative w-full h-full">
                  {/* 缩放容器 */}
                  <div className="origin-top-left" style={scaleContainer}>
                    <iframe
                      src={previewUrl}
                      className="w-full h-full border-0 bg-white"
                      title={`${previewTitle} preview`}
                      loading="lazy"
                      sandbox="allow-scripts allow-same-origin"
                      onLoad={() => setIframeLoaded(true)}
                    />
                  </div>

                  {/* 加载遮罩 */}
                  {!iframeLoaded && (
                    <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center z-10">
                      <div className="text-xs text-gray-500">Loading preview...</div>
                    </div>
                  )}

                  {/* 预览标识 */}
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-1.5 z-10">
                    <Eye className="w-3 h-3 text-gray-600" />
                  </div>

                  {/* 点击遮罩 */}
                  <Link
                    href={href}
                    className="absolute inset-0 z-20 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault()
                      window.location.href = href
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Hover overlay with link */}
          <Link
            href={href}
            className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-300 ${
              isHovered && !showPreview ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 transform transition-transform duration-300 hover:scale-110">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </div>
          </Link>
        </div>
      </div>

      {/* 内容插槽 */}
      {children}
    </Card>
  )
}
