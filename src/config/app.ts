/**
 * 应用程序配置
 */

import { clientEnv, serverEnv, isDevelopment } from './env';

// API配置
const apiConfig = {
  // 使用环境变量配置API基础URL
  baseUrl: process.env.NEXT_PUBLIC_API_URL || (isDevelopment
    ? 'http://localhost:8000/api' // 开发环境默认值
    : 'https://api.yourdomain.com/api'), // 生产环境默认值
  timeout: 10000, // 请求超时时间（毫秒）
  retries: 3, // 请求重试次数
};

// 应用程序配置
export const appConfig = {
  name: '我的博客',
  description: '个人博客和文档系统',
  version: '1.0.0',
  
  // API配置
  api: apiConfig,
  
  // 路由配置
  routes: {
    home: '/',
    docs: '/docs',
    categories: '/docs/categories',
    login: '/auth/login',
    register: '/auth/register',
  },
  
  // 功能开关
  features: {
    darkMode: true,
    comments: true,
    search: true,
  },
  
  // 主题配置
  theme: {
    primaryColor: '#3b82f6',
    secondaryColor: '#10b981',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
};