"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Heart, Bookmark, Share2 } from "lucide-react"
import { useState } from "react"
import { likeArticle, bookmarkArticle } from "@/lib/api/database"

interface ArticleActionsProps {
  articleId: number
  likes: number
  bookmarks: number
  comments: number
  onLike?: (newLikes: number) => void
  onBookmark?: (newBookmarks: number) => void
  onShare?: () => void
}

export function ArticleActions({ 
  articleId, 
  likes, 
  bookmarks, 
  comments, 
  onLike, 
  onBookmark, 
  onShare 
}: ArticleActionsProps) {
  const [isLiking, setIsLiking] = useState(false)
  const [isBookmarking, setIsBookmarking] = useState(false)
  const [currentLikes, setCurrentLikes] = useState(likes)
  const [currentBookmarks, setCurrentBookmarks] = useState(bookmarks)

  const handleLike = async () => {
    if (isLiking) return
    
    setIsLiking(true)
    try {
      const updatedArticle = await likeArticle(articleId)
      const newLikes = updatedArticle.likes
      setCurrentLikes(newLikes)
      onLike?.(newLikes)
    } catch (error) {
      console.error('点赞失败:', error)
      // TODO: 显示错误提示
    } finally {
      setIsLiking(false)
    }
  }

  const handleBookmark = async () => {
    if (isBookmarking) return
    
    setIsBookmarking(true)
    try {
      const updatedArticle = await bookmarkArticle(articleId)
      const newBookmarks = updatedArticle.bookmarks
      setCurrentBookmarks(newBookmarks)
      onBookmark?.(newBookmarks)
    } catch (error) {
      console.error('收藏失败:', error)
      // TODO: 显示错误提示
    } finally {
      setIsBookmarking(false)
    }
  }

  return (
    <>
      <Separator/>
      <div className="p-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 hover:bg-theme-accent cursor-pointer"
              onClick={handleLike}
              disabled={isLiking}
            >
              <Heart className="h-4 w-4" />
              {isLiking ? '点赞中...' : `点赞 (${currentLikes})`}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 hover:bg-theme-accent cursor-pointer"
              onClick={handleBookmark}
              disabled={isBookmarking}
            >
              <Bookmark className="h-4 w-4" />
              {isBookmarking ? '收藏中...' : `收藏 (${currentBookmarks})`}
            </Button>
            <Button variant="outline" size="sm" className="gap-2 hover:bg-theme-accent cursor-pointer" onClick={onShare}>
              <Share2 className="h-4 w-4" />
              分享
            </Button>
          </div>
          <div className="text-sm text-gray-600">{comments} 条评论</div>
        </div>
      </div>
    </>
  )
}
