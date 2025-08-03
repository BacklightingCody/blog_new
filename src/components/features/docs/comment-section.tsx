/**
 * 评论区组件
 * 支持评论展示、回复、点赞等功能
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  ThumbsUp, 
  Reply, 
  MoreHorizontal,
  Send,
  Heart,
  User
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface Comment {
  id: number;
  content: string;
  author: {
    id: number;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

interface CommentSectionProps {
  articleId: number;
}

// Mock评论数据
const mockComments: Comment[] = [
  {
    id: 1,
    content: '这篇文章写得很好，对我帮助很大！特别是关于实践部分的内容，让我对这个主题有了更深入的理解。',
    author: {
      id: 1,
      name: '张三',
      avatar: '/avatars/zhang.jpg',
    },
    createdAt: '2024-01-20T10:30:00Z',
    likes: 12,
    isLiked: false,
    replies: [
      {
        id: 2,
        content: '同感！作者的讲解很清晰。',
        author: {
          id: 2,
          name: '李四',
          avatar: '/avatars/li.jpg',
        },
        createdAt: '2024-01-20T11:15:00Z',
        likes: 3,
        isLiked: true,
      }
    ]
  },
  {
    id: 3,
    content: '有个小问题想请教一下，关于第三部分的实现方式，是否还有其他的解决方案？',
    author: {
      id: 3,
      name: '王五',
      avatar: '/avatars/wang.jpg',
    },
    createdAt: '2024-01-20T14:20:00Z',
    likes: 5,
    isLiked: false,
  },
  {
    id: 4,
    content: '感谢分享！已经收藏了，准备按照文章的步骤实践一下。',
    author: {
      id: 4,
      name: '赵六',
      avatar: '/avatars/zhao.jpg',
    },
    createdAt: '2024-01-20T16:45:00Z',
    likes: 8,
    isLiked: false,
  }
];

export function CommentSection({ articleId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 提交新评论
  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000));

    const comment: Comment = {
      id: Date.now(),
      content: newComment,
      author: {
        id: 999,
        name: '当前用户',
        avatar: '/avatars/current-user.jpg',
      },
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
    };

    setComments(prev => [comment, ...prev]);
    setNewComment('');
    setIsSubmitting(false);
  };

  // 提交回复
  const handleSubmitReply = async (parentId: number) => {
    if (!replyContent.trim()) return;

    setIsSubmitting(true);
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000));

    const reply: Comment = {
      id: Date.now(),
      content: replyContent,
      author: {
        id: 999,
        name: '当前用户',
        avatar: '/avatars/current-user.jpg',
      },
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
    };

    setComments(prev => prev.map(comment => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), reply]
        };
      }
      return comment;
    }));

    setReplyContent('');
    setReplyingTo(null);
    setIsSubmitting(false);
  };

  // 点赞评论
  const handleLikeComment = (commentId: number, isReply = false, parentId?: number) => {
    setComments(prev => prev.map(comment => {
      if (isReply && comment.id === parentId) {
        return {
          ...comment,
          replies: comment.replies?.map(reply => {
            if (reply.id === commentId) {
              return {
                ...reply,
                isLiked: !reply.isLiked,
                likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1
              };
            }
            return reply;
          })
        };
      } else if (comment.id === commentId) {
        return {
          ...comment,
          isLiked: !comment.isLiked,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
        };
      }
      return comment;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-5 w-5" />
        <h3 className="text-xl font-semibold">评论 ({comments.length})</h3>
      </div>

      {/* 发表评论 */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Textarea
              placeholder="写下你的想法..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isSubmitting}
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? '发布中...' : '发布评论'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 评论列表 */}
      <div className="space-y-4">
        <AnimatePresence>
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CommentItem
                comment={comment}
                onLike={(id) => handleLikeComment(id)}
                onReply={(id) => setReplyingTo(id)}
                onLikeReply={(replyId, parentId) => handleLikeComment(replyId, true, parentId)}
              />
              
              {/* 回复输入框 */}
              {replyingTo === comment.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="ml-12 mt-4"
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <Textarea
                          placeholder={`回复 @${comment.author.name}...`}
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          className="min-h-[80px] resize-none"
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyContent('');
                            }}
                          >
                            取消
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleSubmitReply(comment.id)}
                            disabled={!replyContent.trim() || isSubmitting}
                            className="gap-2"
                          >
                            <Send className="h-3 w-3" />
                            {isSubmitting ? '回复中...' : '回复'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {comments.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>还没有评论，来发表第一条评论吧！</p>
        </div>
      )}
    </div>
  );
}

interface CommentItemProps {
  comment: Comment;
  onLike: (id: number) => void;
  onReply: (id: number) => void;
  onLikeReply: (replyId: number, parentId: number) => void;
}

function CommentItem({ comment, onLike, onReply, onLikeReply }: CommentItemProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* 评论头部 */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{comment.author.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.createdAt), { 
                    addSuffix: true, 
                    locale: zhCN 
                  })}
                </p>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>举报</DropdownMenuItem>
                <DropdownMenuItem>复制链接</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* 评论内容 */}
          <div className="text-sm leading-relaxed">
            {comment.content}
          </div>

          {/* 评论操作 */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLike(comment.id)}
              className={`gap-2 ${comment.isLiked ? 'text-red-500' : ''}`}
            >
              <Heart className={`h-4 w-4 ${comment.isLiked ? 'fill-current' : ''}`} />
              <span>{comment.likes}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReply(comment.id)}
              className="gap-2"
            >
              <Reply className="h-4 w-4" />
              回复
            </Button>
          </div>

          {/* 回复列表 */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="ml-6 space-y-4 border-l-2 border-muted pl-6">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={reply.author.avatar} alt={reply.author.name} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{reply.author.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(reply.createdAt), { 
                            addSuffix: true, 
                            locale: zhCN 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm leading-relaxed">
                    {reply.content}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onLikeReply(reply.id, comment.id)}
                      className={`gap-2 ${reply.isLiked ? 'text-red-500' : ''}`}
                    >
                      <Heart className={`h-3 w-3 ${reply.isLiked ? 'fill-current' : ''}`} />
                      <span>{reply.likes}</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}