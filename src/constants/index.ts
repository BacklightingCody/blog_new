/**
 * 常量统一导出
 * 整合所有常量定义
 */

// 导出应用常量
export * from './app';

// 导出默认封面
export * from './default_cover';

// 分类名称映射（保持原有功能）
export const categoryNameMap = {
  programming: "编程",
  recipe: "食谱",
  ai: "AI",
  life: "生活",
} as const;

// 分类颜色映射
export const categoryColorMap = {
  programming: "#3b82f6", // 蓝色
  recipe: "#10b981", // 绿色
  ai: "#8b5cf6", // 紫色
  life: "#f59e0b", // 橙色
} as const;

// 分类图标映射
export const categoryIconMap = {
  programming: "💻",
  recipe: "🍳",
  ai: "🤖",
  life: "🌱",
} as const;

// 标签颜色预设
export const tagColors = [
  "#ef4444", // 红色
  "#f97316", // 橙色
  "#eab308", // 黄色
  "#22c55e", // 绿色
  "#06b6d4", // 青色
  "#3b82f6", // 蓝色
  "#8b5cf6", // 紫色
  "#ec4899", // 粉色
] as const;

// 优先级映射
export const priorityMap = {
  low: { label: "低", color: "#6b7280", value: 1 },
  medium: { label: "中", color: "#f59e0b", value: 2 },
  high: { label: "高", color: "#ef4444", value: 3 },
  urgent: { label: "紧急", color: "#dc2626", value: 4 },
} as const;

// 状态映射
export const statusMap = {
  draft: { label: "草稿", color: "#6b7280" },
  review: { label: "审核中", color: "#f59e0b" },
  published: { label: "已发布", color: "#10b981" },
  archived: { label: "已归档", color: "#8b5cf6" },
  deleted: { label: "已删除", color: "#ef4444" },
} as const;

// 导出类型
export type CategoryKey = keyof typeof categoryNameMap;
export type TagColor = typeof tagColors[number];
export type Priority = keyof typeof priorityMap;
export type Status = keyof typeof statusMap;