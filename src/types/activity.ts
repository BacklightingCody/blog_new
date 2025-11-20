// 基于后端Prisma schema的活动相关类型定义

/**
 * 活动类型枚举
 */
export enum ActivityType {
  APPLICATION_FOCUS = 'APPLICATION_FOCUS', // 应用程序获得焦点
  APPLICATION_BLUR = 'APPLICATION_BLUR',   // 应用程序失去焦点
  WINDOW_CHANGE = 'WINDOW_CHANGE',         // 窗口切换
  IDLE_START = 'IDLE_START',               // 开始空闲
  IDLE_END = 'IDLE_END',                   // 结束空闲
  SYSTEM_LOCK = 'SYSTEM_LOCK',             // 系统锁定
  SYSTEM_UNLOCK = 'SYSTEM_UNLOCK'          // 系统解锁
}

/**
 * 活动状态枚举
 */
export enum ActivityStatus {
  ACTIVE = 'ACTIVE',
  IDLE = 'IDLE',
  OFFLINE = 'OFFLINE'
}

/**
 * 用户活动接口
 */
export interface UserActivity {
  id: string;
  
  // 用户关联
  userId: number;
  
  // 活动信息
  activityType: ActivityType;
  applicationName: string | null;
  windowTitle: string | null;
  processName: string | null;
  
  // 系统信息
  operatingSystem: string | null;
  deviceName: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  
  // 时间信息
  startTime: string;
  endTime: string | null;
  duration: number | null; // 持续时间（秒）
  
  // 额外数据
  metadata: Record<string, any> | null;
  
  createdAt: string;
  updatedAt: string;
}

/**
 * 用户活动状态接口
 */
export interface UserActivityStatus {
  id: string;
  
  // 用户关联
  userId: number;
  
  // 当前状态
  currentStatus: ActivityStatus;
  lastActivity: string | null;
  
  // 当前活动信息
  currentApp: string | null;
  currentWindow: string | null;
  
  // 在线时长统计
  todayOnlineTime: number; // 今日在线时长（秒）
  totalOnlineTime: number; // 总在线时长（秒）
  
  createdAt: string;
  updatedAt: string;
}

/**
 * 活动统计接口
 */
export interface ActivityStats {
  totalTime: number;
  activeTime: number;
  idleTime: number;
  applications?: ApplicationUsage[];
  dailyStats?: DailyStats[];
  topApplications?: ApplicationUsage[];
}

/**
 * 应用使用情况接口
 */
export interface ApplicationUsage {
  name: string;
  time: number;
  percentage: number;
}

/**
 * 每日统计接口
 */
export interface DailyStats {
  date: string;
  time: number;
}

/**
 * 活动创建请求接口
 */
export interface CreateActivityRequest {
  activityType: ActivityType;
  applicationName?: string;
  windowTitle?: string;
  processName?: string;
  operatingSystem?: string;
  deviceName?: string;
  ipAddress?: string;
  userAgent?: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  metadata?: Record<string, any>;
}

/**
 * 活动更新请求接口
 */
export interface UpdateActivityRequest {
  endTime?: string;
  duration?: number;
  metadata?: Record<string, any>;
}

/**
 * 活动状态更新请求接口
 */
export interface UpdateActivityStatusRequest {
  currentStatus: ActivityStatus;
  currentApp?: string;
  currentWindow?: string;
  todayOnlineTime?: number;
  totalOnlineTime?: number;
}

/**
 * 活动查询参数接口
 */
export interface ActivityQueryParams {
  userId?: number;
  activityType?: ActivityType;
  startDate?: string;
  endDate?: string;
  applicationName?: string;
  limit?: number;
  offset?: number;
}

/**
 * 活动统计查询参数接口
 */
export interface ActivityStatsQueryParams {
  userId: number;
  period: 'today' | 'week' | 'month' | 'year';
  startDate?: string;
  endDate?: string;
}