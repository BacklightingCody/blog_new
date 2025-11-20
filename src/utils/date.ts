/**
 * 日期格式化工具函数
 */

import { format, formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

/**
 * 格式化日期为相对时间
 */
export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: zhCN
    });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return '未知时间';
  }
}

/**
 * 格式化日期为标准格式
 */
export function formatDate(dateString: string, pattern = 'yyyy-MM-dd'): string {
  try {
    const date = new Date(dateString);
    return format(date, pattern, { locale: zhCN });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '未知日期';
  }
}

/**
 * 格式化日期时间
 */
export function formatDateTime(dateString: string): string {
  return formatDate(dateString, 'yyyy-MM-dd HH:mm:ss');
}

/**
 * 获取友好的日期显示
 */
export function getFriendlyDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return '今天';
    } else if (diffInDays === 1) {
      return '昨天';
    } else if (diffInDays < 7) {
      return `${diffInDays} 天前`;
    } else {
      return formatDate(dateString, 'MM-dd');
    }
  } catch (error) {
    console.error('Error getting friendly date:', error);
    return '未知时间';
  }
}
