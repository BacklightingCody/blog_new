"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThumbsUp, User } from "lucide-react"
import { useState } from "react"

interface Comment {
  id: number
  author: string
  avatar?: string
  content: string
  time: string
  likes: number
}

interface CommentSectionProps {
  comments: Comment[]
  onAddComment?: (content: string) => void
  onLikeComment?: (commentId: number) => void
}

export function CommentSection({ comments, onAddComment, onLikeComment }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("")

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
        <h3 className="text-xl font-semibold mb-6">评论 ({comments.length})</h3>

        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src={comment.avatar || "/placeholder.svg"} alt={comment.author} />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-gray-900">{comment.author}</span>
                  <span className="text-sm text-gray-500">{comment.time}</span>
                </div>
                <p className="text-gray-800 mb-3 leading-relaxed">{comment.content}</p>
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-gray-600 hover:text-gray-900"
                    onClick={() => onLikeComment?.(comment.id)}
                  >
                    <ThumbsUp className="h-3 w-3" />
                    {comment.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
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
