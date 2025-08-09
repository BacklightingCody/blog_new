'use client';

import { create } from 'zustand';

// 通知类型
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

// 通知接口
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number; // 显示时长（毫秒），0表示不自动消失
  createdAt: string;
}

// 搜索结果接口
export interface SearchResult {
  id: string;
  title: string;
  content: string;
  url: string;
  type: 'article' | 'chat' | 'bookmark' | 'other';
  relevance: number; // 相关度评分 0-1
  createdAt: string;
}

// 应用状态接口
interface AppState {
  // 全局加载状态
  isLoading: boolean;
  loadingMessage?: string;
  
  // 通知系统
  notifications: Notification[];
  
  // 搜索状态
  searchQuery: string;
  searchResults: SearchResult[];
  isSearching: boolean;
  searchHistory: string[];
  
  // 侧边栏状态
  sidebarCollapsed: boolean;
  
  // 模态框状态
  modals: {
    [key: string]: boolean;
  };
  
  // 错误状态
  globalError: string | null;
  
  // 网络状态
  isOnline: boolean;
  
  // 应用版本信息
  version: string;
  lastUpdated: string;
}

// 应用动作接口
interface AppActions {
  // 加载状态管理
  setLoading: (loading: boolean, message?: string) => void;
  
  // 通知管理
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  removeNotification: (notificationId: string) => void;
  clearNotifications: () => void;
  
  // 搜索管理
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: SearchResult[]) => void;
  setIsSearching: (searching: boolean) => void;
  addToSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  clearSearch: () => void;
  
  // 侧边栏管理
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // 模态框管理
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  toggleModal: (modalId: string) => void;
  closeAllModals: () => void;
  
  // 错误管理
  setGlobalError: (error: string | null) => void;
  clearGlobalError: () => void;
  
  // 网络状态管理
  setOnlineStatus: (online: boolean) => void;
  
  // 应用信息管理
  updateAppInfo: (version: string, lastUpdated: string) => void;
}

type AppStore = AppState & AppActions;

// 创建应用状态管理
export const useAppStore = create<AppStore>((set, get) => ({
  // 初始状态
  isLoading: false,
  loadingMessage: undefined,
  notifications: [],
  searchQuery: '',
  searchResults: [],
  isSearching: false,
  searchHistory: [],
  sidebarCollapsed: false,
  modals: {},
  globalError: null,
  isOnline: true,
  version: '1.0.0',
  lastUpdated: new Date().toISOString(),

  // 加载状态管理
  setLoading: (loading, message) => {
    set({ isLoading: loading, loadingMessage: message });
  },

  // 通知管理
  addNotification: (notificationData) => {
    const notification: Notification = {
      ...notificationData,
      id: `notification_${Date.now()}`,
      createdAt: new Date().toISOString(),
      duration: notificationData.duration ?? 5000 // 默认5秒
    };

    set((state) => ({
      notifications: [notification, ...state.notifications]
    }));

    // 自动移除通知
    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        get().removeNotification(notification.id);
      }, notification.duration);
    }
  },

  removeNotification: (notificationId) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== notificationId)
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },

  // 搜索管理
  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  setSearchResults: (results) => {
    set({ searchResults: results });
  },

  setIsSearching: (searching) => {
    set({ isSearching: searching });
  },

  addToSearchHistory: (query) => {
    if (!query.trim()) return;

    set((state) => {
      const filteredHistory = state.searchHistory.filter((item) => item !== query);
      const newHistory = [query, ...filteredHistory].slice(0, 20); // 最多保留20条搜索历史
      return { searchHistory: newHistory };
    });
  },

  clearSearchHistory: () => {
    set({ searchHistory: [] });
  },

  clearSearch: () => {
    set({
      searchQuery: '',
      searchResults: [],
      isSearching: false
    });
  },

  // 侧边栏管理
  toggleSidebar: () => {
    set((state) => ({
      sidebarCollapsed: !state.sidebarCollapsed
    }));
  },

  setSidebarCollapsed: (collapsed) => {
    set({ sidebarCollapsed: collapsed });
  },

  // 模态框管理
  openModal: (modalId) => {
    set((state) => ({
      modals: { ...state.modals, [modalId]: true }
    }));
  },

  closeModal: (modalId) => {
    set((state) => ({
      modals: { ...state.modals, [modalId]: false }
    }));
  },

  toggleModal: (modalId) => {
    set((state) => ({
      modals: { ...state.modals, [modalId]: !state.modals[modalId] }
    }));
  },

  closeAllModals: () => {
    set({ modals: {} });
  },

  // 错误管理
  setGlobalError: (error) => {
    set({ globalError: error });
  },

  clearGlobalError: () => {
    set({ globalError: null });
  },

  // 网络状态管理
  setOnlineStatus: (online) => {
    set({ isOnline: online });
    
    // 网络状态变化时添加通知
    if (online) {
      get().addNotification({
        type: 'success',
        title: '网络已连接',
        message: '网络连接已恢复',
        duration: 3000
      });
    } else {
      get().addNotification({
        type: 'warning',
        title: '网络已断开',
        message: '请检查网络连接',
        duration: 0 // 不自动消失
      });
    }
  },

  // 应用信息管理
  updateAppInfo: (version, lastUpdated) => {
    set({ version, lastUpdated });
  }
}));

// 监听网络状态变化
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    useAppStore.getState().setOnlineStatus(true);
  });

  window.addEventListener('offline', () => {
    useAppStore.getState().setOnlineStatus(false);
  });
}