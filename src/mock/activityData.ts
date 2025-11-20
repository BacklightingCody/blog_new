// import { Activity } from '@/types'; // Activity类型不存在，暂时注释

// 临时定义Activity类型
interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

export const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'login',
    description: '用户登录系统',
    timestamp: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    type: 'create_article',
    description: '创建了新文章《React基础教程》',
    timestamp: '2024-01-15T09:30:00Z'
  },
  {
    id: '3',
    type: 'update_profile',
    description: '更新了个人资料',
    timestamp: '2024-01-15T09:00:00Z'
  },
  {
    id: '4',
    type: 'comment',
    description: '在文章《Vue.js入门》下发表了评论',
    timestamp: '2024-01-15T08:30:00Z'
  }
];