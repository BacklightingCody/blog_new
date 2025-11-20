/**
 * 客户端评论服务
 * 用于客户端组件中的评论数据操作
 */

import { ClientService } from './base';
import { Comment } from '@/types/article';

export interface CommentData {
  content: string;
  parentId?: number;
}

export interface CommentWithReplies extends Comment {
  replies: Comment[];
  likes: number;
  isLiked: boolean;
}

export class CommentsClientService extends ClientService {
  /**
   * 获取文章评论列表
   */
  async getComments(articleId: number) {
    return this.get<CommentWithReplies[]>(`/articles/${articleId}/comments`);
  }

  /**
   * 发表评论
   */
  async postComment(articleId: number, data: CommentData) {
    return this.post<Comment>(`/articles/${articleId}/comments`, data);
  }

  /**
   * 回复评论
   */
  async replyToComment(articleId: number, parentId: number, data: Omit<CommentData, 'parentId'>) {
    return this.post<Comment>(`/articles/${articleId}/comments`, {
      ...data,
      parentId
    });
  }

  /**
   * 点赞评论
   */
  async likeComment(articleId: number, commentId: number) {
    return this.post(`/articles/${articleId}/comments/${commentId}/like`);
  }

  /**
   * 删除评论
   */
  async deleteComment(articleId: number, commentId: number) {
    return this.delete(`/articles/${articleId}/comments/${commentId}`);
  }

  /**
   * 更新评论
   */
  async updateComment(articleId: number, commentId: number, data: { content: string }) {
    return this.put<Comment>(`/articles/${articleId}/comments/${commentId}`, data);
  }
}

// 创建单例实例
export const commentsClientService = new CommentsClientService();
