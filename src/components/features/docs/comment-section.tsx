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

import { fetchComments as apiFetchComments, postComment as apiPostComment, postReply as apiPostReply, likeComment as apiLikeComment } from '@/services/articles'
import { getArticleComments, postComment as apiPostCommentNew, replyToComment, likeComment as apiLikeCommentNew, deleteComment } from '@/lib/api/database'

export function CommentSection({ articleId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  
  // 使用新的API加载评论
  useEffect(() => {
    const load = async () => {
      try {
        const result = await getArticleComments(articleId, { limit: 50 });
        const mapped: Comment[] = result.comments.map((c: any) => ({
          id: c.id,
          content: c.content,
          author: {
            id: c.user?.id || 1,
            name: c.user?.firstName || c.user?.username || 'Anonymous',
            avatar: c.user?.imageUrl,
          },
          createdAt: c.createdAt,
          likes: c.likes || 0,
          isLiked: false,
          // TODO: 如果后端支持回复层级，可以在这里处理replies
          replies: [],
        }));
        setComments(mapped);
      } catch (error) {
        console.error('加载评论失败:', error);
      }
    };
    load();
  }, [articleId]);
  
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 提交新评论
  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const commentData = await apiPostCommentNew(articleId, newComment.trim());
      
      if (commentData) {
        const mapped: Comment = {
          id: commentData.id,
          content: commentData.content,
          author: { 
            id: commentData.user?.id || 1, 
            name: commentData.user?.firstName || commentData.user?.username || 'Anonymous', 
            avatar: commentData.user?.imageUrl 
          },
          createdAt: commentData.createdAt,
          likes: 0,
          isLiked: false,
          replies: [],
        };
        setComments(prev => [mapped, ...prev]);
        setNewComment('');
      }
    } catch (error) {
      console.error('发表评论失败:', error);
      // TODO: 显示错误提示
    } finally {
      setIsSubmitting(false);
    }
  };

  // 提交回复
  const handleSubmitReply = async (parentId: number) => {
    if (!replyContent.trim()) return;

    setIsSubmitting(true);
    try {
      const replyData = await replyToComment(articleId, parentId, replyContent.trim());
      
      if (replyData) {
        const mapped: Comment = {
          id: replyData.id,
          content: replyData.content,
          author: { 
            id: replyData.user?.id || 1, 
            name: replyData.user?.firstName || replyData.user?.username || 'Anonymous', 
            avatar: replyData.user?.imageUrl 
          },
          createdAt: replyData.createdAt,
          likes: 0,
          isLiked: false,
        };
        
        // 目前简单地将回复添加到父评论的replies中
        // 如果后端支持层级结构，可以优化这里
        setComments(prev => prev.map(comment => {
          if (comment.id === parentId) {
            return { ...comment, replies: [...(comment.replies || []), mapped] };
          }
          return comment;
        }));
        
        setReplyContent('');
        setReplyingTo(null);
      }
    } catch (error) {
      console.error('回复评论失败:', error);
      // TODO: 显示错误提示
    } finally {
      setIsSubmitting(false);
    }
  };

  // 点赞评论
  const handleLikeComment = async (commentId: number, isReply = false, parentId?: number) => {
    try {
      await apiLikeCommentNew(articleId, commentId);
      
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
    } catch (error) {
      console.error('点赞评论失败:', error);
      // TODO: 显示错误提示
    }
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