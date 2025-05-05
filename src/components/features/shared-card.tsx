"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Share2, Check, X, Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import html2canvas from "html2canvas"
import domtoimage from 'dom-to-image';

interface ShareBookCardProps {
  book: {
    title: string
    author: string
    cover: string
    description: string
    progress: number
    tags?: string[]
  }
  onClose: () => void
}

export function ShareBookCard({ book, onClose }: ShareBookCardProps) {
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // 生成分享文本
  const shareText = `我想向你推荐《${book.title}》这本书，作者是${book.author}。${book.description?.substring(0, 100)}...`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleDownloadImage = async () => {
    if (!cardRef.current) return

    try {
      setDownloading(true);

      // 使用 dom-to-image 生成图片
      const dataUrl = await domtoimage.toPng(cardRef.current, {
        // bgcolor: '#fff', // 设置背景色为白色（如果需要背景色）
        filter: (node: HTMLElement) => node.tagName !== 'BUTTON', // 排除按钮，避免其出现在图片中
        style: {
          transform: 'scale(1)', // 确保元素不被缩放
          transformOrigin: 'top left', // 从左上角开始渲染
        },
        useCORS: true, // 确保跨域图片资源能够正确加载
      });

      // 创建下载链接
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `推荐-${book.title}.png`;  // 设置下载文件名
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error("下载图片失败:", error);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <motion.div
        ref={cardRef}
        className="relative w-full max-w-md bg-theme-accent rounded-lg shadow-xl overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <button
          onClick={onClose}
          className="absolute right-2 top-2 p-1 rounded-full bg-theme-secondary  hover:cursor-pointer z-10 close-btn"
        >
          <X className="h-4 w-4" />
        </button>

        {/* 卡片头部 */}
        <div className="bg-gradient-to-r from-primary/20 to-primary/10 p-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={book.cover || "/placeholder.svg"}
                alt={book.title}
                className="w-20 h-28 object-cover rounded shadow-md"
                crossOrigin="anonymous"
              />
              <div className="absolute -bottom-2 -right-2 bg-theme-accent rounded-full p-1 shadow-md">
                <Share2 className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold line-clamp-2">{book.title}</h3>
              <p className="text-sm text-primary-color">{book.author}</p>
              {book.tags && book.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {book.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="text-xs bg-theme-accent px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                  {book.tags.length > 3 && (
                    <span className="text-xs bg-theme-accent px-2 py-0.5 rounded-full">+{book.tags.length - 3}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 卡片内容 */}
        <div className="p-6 bg-theme-secondary">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Share2 className="h-4 w-4 text-primary" />
            推荐给朋友
          </h4>

          <div className="bg-gray-50 rounded-md p-3 mb-4">
            <p className="text-sm text-gray-700 line-clamp-3">{shareText}</p>
          </div>

          {book.progress > 0 && (
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span>我的阅读进度</span>
                <span>{book.progress}%</span>
              </div>
              <Progress value={book.progress} className="h-1.5" />
            </div>
          )}

          <div className="flex gap-2 mt-4 action-btns">
            <Button variant="outline" className="flex-1 gap-2 cursor-pointer" onClick={handleDownloadImage}>
              {downloading ? (
                <>
                  <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  处理中...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  以图片形式
                </>
              )}
            </Button>
            <Button className="flex-1 gap-2 cursor-pointer" onClick={handleCopyLink}>
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  已复制
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  推荐文本
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
