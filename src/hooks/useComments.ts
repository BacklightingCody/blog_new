/**
 * 评论数据相关的 Hook
 */

import { useState, useEffect, useCallback } from 'react';
import { articlesApi } from '@/lib/api/articles';
// We need to ensure these types exist or import them correctly. 
// Assuming CommentWithReplies and CommentData are needed.
// If they were in services/comments-client, we need to define them or import them from types.
import { Comment } from '@/types/article';

export interface CommentData {
  content: string;
  parentId?: number;
}

export interface CommentWithReplies extends Comment {
  replies: CommentWithReplies[];
  isLiked?: boolean;
  likes: number;
}

export interface UseCommentsReturn {
  comments: CommentWithReplies[];
  loading: boolean;
  error: string | null;
  submitting: boolean;
  postComment: (data: CommentData) => Promise<boolean>;
  likeComment: (commentId: number, isReply?: boolean, parentId?: number) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useComments(articleId: number): UseCommentsReturn {
  const [comments, setComments] = useState<CommentWithReplies[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    if (!articleId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await articlesApi.comments.list(articleId);

      if (response.success && response.data) {
        setComments(response.data);
      } else {
        setError(response.error || 'Failed to fetch comments');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [articleId]);

  const postComment = useCallback(async (data: CommentData): Promise<boolean> => {
    if (!articleId) return false;

    setSubmitting(true);
    setError(null);

    try {
      const response = data.parentId
        ? await articlesApi.comments.reply(articleId, data.parentId, data.content)
        : await articlesApi.comments.create(articleId, data.content);

      if (response.success && response.data) {
        // 重新获取评论列表
        await fetchComments();
        return true;
      } else {
        setError(response.error || 'Failed to post comment');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [articleId, fetchComments]);

  const likeComment = useCallback(async (commentId: number, isReply = false, parentId?: number) => {
    if (!articleId) return;

    try {
      await articlesApi.comments.like(articleId, commentId);

      // 乐观更新 UI
      setComments(prev => prev.map(comment => {
        if (isReply && comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies.map(reply => {
              if (reply.id === commentId) {
                const isLiked = !reply.isLiked;
                return {
                  ...reply,
                  isLiked,
                  likes: isLiked ? reply.likes + 1 : reply.likes - 1,
                };
              }
              return reply;
            })
          };
        } else if (comment.id === commentId) {
          const isLiked = !comment.isLiked;
          return {
            ...comment,
            isLiked,
            likes: isLiked ? comment.likes + 1 : comment.likes - 1,
          };
        }
        return comment;
      }));
    } catch (err) {
      console.error('Failed to like comment:', err);
    }
  }, [articleId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return {
    comments,
    loading,
    error,
    submitting,
    postComment,
    likeComment,
    refetch: fetchComments,
  };
}
