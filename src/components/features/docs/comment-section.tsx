"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThumbsUp, User } from "lucide-react"
import { useState } from "react"
import type { Comment as ApiComment } from "@/types/article"
import { getAuthorDisplayName, formatArticleDate } from "@/utils/article-transform"

interface Comment {
  id: number
  author: string
  avatar?: string
  content: string
  time: string
  likes: number
}

// 适配器函数：将API评论转换为组件所需格式
function adaptApiComment(apiComment: ApiComment): Comment {
  return {
    id: apiComment.id,
    author: getAuthorDisplayName(apiComment.user),
    avatar: apiComment.user.imageUrl || undefined,
    content: apiComment.content,
    time: formatArticleDate(apiComment.createdAt),
    likes: 0, // API暂不支持评论点赞
  }
}

interface CommentSectionProps {
  comments: Comment[] | ApiComment[]
  onAddComment?: (content: string) => void
  onLikeComment?: (commentId: number) => void
}

export function CommentSection({ comments, onAddComment, onLikeComment }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("")

  // 转换评论数据
  const displayComments: Comment[] = comments.map(comment => {
    // 检查是否是API评论格式
    if ('user' in comment) {
      return adaptApiComment(comment as ApiComment)
    }
    return comment as Comment
  })

  const handleSubmitComment = () => {
    if (newComment.trim() && onAddComment) {
      onAddComment(newComment)
      setNewComment("")
    }
  }

  return (
    <>
      <Separator />
      <div className="p-8">
        <h3 className="text-xl font-semibold mb-6">评论 ({displayComments.length})</h3>

        <div className="space-y-6">
          {displayComments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src={comment.avatar || "/placeholder.svg"} alt={comment.author} />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">{comment.author}</span>
                  <span className="text-sm text-gray-500">{comment.time}</span>
                </div>
                <p className="mb-3 leading-relaxed">{comment.content}</p>
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 hover:cursor-pointer"
                    onClick={() => onLikeComment?.(comment.id)}
                  >
                    <ThumbsUp className="h-3 w-3" />
                    {comment.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="hover:cursor-pointer">
                    回复
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 添加评论 */}
        <div className="mt-8 pt-6 border-t">
          <div className="flex gap-4">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <textarea
                placeholder="写下你的评论..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <div className="flex justify-end mt-3">
                <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
                  发表评论
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
