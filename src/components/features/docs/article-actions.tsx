"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Heart, Bookmark, Share2 } from "lucide-react"

interface ArticleActionsProps {
  likes: number
  bookmarks: number
  comments: number
  onLike?: () => void
  onBookmark?: () => void
  onShare?: () => void
}

export function ArticleActions({ likes, bookmarks, comments, onLike, onBookmark, onShare }: ArticleActionsProps) {
  return (
    <>
      <Separator />
      <div className="p-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="gap-2" onClick={onLike}>
              <Heart className="h-4 w-4" />
              点赞 ({likes})
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={onBookmark}>
              <Bookmark className="h-4 w-4" />
              收藏 ({bookmarks})
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={onShare}>
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
