/**
 * 通用类型定义
 */

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 分页类型
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// 分页数据响应类型
export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

// 搜索参数类型
export interface SearchParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

// 用户基础信息类型
export interface BaseUser {
  id: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  imageUrl?: string;
}

// 标签类型
export interface Tag {
  id: number;
  name: string;
  color?: string;
  description?: string;
}

// 文章标签关联类型
export interface ArticleTag {
  tag: Tag;
}

// 分类类型
export interface Category {
  id: string;
  name: string;
  description: string;
  count: number;
  slug?: string;
}

// 组件通用 Props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// 加载状态类型
export interface LoadingState {
  loading: boolean;
  error: string | null;
}

// 表单状态类型
export interface FormState<T = any> extends LoadingState {
  data: T;
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
}

// 主题类型
export interface ThemeConfig {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

// 导航项类型
export interface NavItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

// 面包屑项类型
export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}
