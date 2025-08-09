'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 用户配置接口
export interface UserPreferences {
  language: 'zh-CN' | 'en-US';
  fontSize: 'small' | 'medium' | 'large';
  autoSave: boolean;
  notifications: boolean;
  theme: 'auto' | 'light' | 'dark';
}

// 用户资料接口
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  displayName: string;
  bio?: string;
  createdAt: string;
  lastLoginAt: string;
}

// 书签接口
export interface Bookmark {
  id: string;
  title: string;
  url: string;
  description?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// 阅读历史接口
export interface ReadingHistoryItem {
  id: string;
  title: string;
  url: string;
  readAt: string;
  readingTime: number; // 阅读时长（秒）
  progress: number; // 阅读进度（0-100）
}

// 用户状态接口
interface UserState {
  // 用户资料
  profile: UserProfile | null;
  
  // 用户偏好设置
  preferences: UserPreferences;
  
  // 书签
  bookmarks: Bookmark[];
  
  // 阅读历史
  readingHistory: ReadingHistoryItem[];
  
  // 加载状态
  isLoading: boolean;
  error: string | null;
}

// 用户动作接口
interface UserActions {
  // 用户资料管理
  setProfile: (profile: UserProfile | null) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  
  // 偏好设置管理
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  
  // 书签管理
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt'>) => void;
  removeBookmark: (bookmarkId: string) => void;
  updateBookmark: (bookmarkId: string, updates: Partial<Bookmark>) => void;
  isBookmarked: (url: string) => boolean;
  getBookmarksByTag: (tag: string) => Bookmark[];
  
  // 阅读历史管理
  addToReadingHistory: (item: Omit<ReadingHistoryItem, 'id'>) => void;
  removeFromReadingHistory: (itemId: string) => void;
  clearReadingHistory: () => void;
  updateReadingProgress: (url: string, progress: number, readingTime: number) => void;
  
  // 状态管理
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type UserStore = UserState & UserActions;

// 默认偏好设置
const defaultPreferences: UserPreferences = {
  language: 'zh-CN',
  fontSize: 'medium',
  autoSave: true,
  notifications: true,
  theme: 'auto'
};

// 创建用户状态管理
export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      profile: null,
      preferences: defaultPreferences,
      bookmarks: [],
      readingHistory: [],
      isLoading: false,
      error: null,

      // 用户资料管理
      setProfile: (profile) => {
        set({ profile });
      },

      updateProfile: (updates) => {
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...updates } : null
        }));
      },

      // 偏好设置管理
      updatePreferences: (preferences) => {
        set((state) => ({
          preferences: { ...state.preferences, ...preferences }
        }));
      },

      resetPreferences: () => {
        set({ preferences: defaultPreferences });
      },

      // 书签管理
      addBookmark: (bookmarkData) => {
        const bookmark: Bookmark = {
          ...bookmarkData,
          id: `bookmark_${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        set((state) => ({
          bookmarks: [bookmark, ...state.bookmarks]
        }));
      },

      removeBookmark: (bookmarkId) => {
        set((state) => ({
          bookmarks: state.bookmarks.filter((bookmark) => bookmark.id !== bookmarkId)
        }));
      },

      updateBookmark: (bookmarkId, updates) => {
        set((state) => ({
          bookmarks: state.bookmarks.map((bookmark) =>
            bookmark.id === bookmarkId
              ? { ...bookmark, ...updates, updatedAt: new Date().toISOString() }
              : bookmark
          )
        }));
      },

      isBookmarked: (url) => {
        const state = get();
        return state.bookmarks.some((bookmark) => bookmark.url === url);
      },

      getBookmarksByTag: (tag) => {
        const state = get();
        return state.bookmarks.filter((bookmark) => bookmark.tags.includes(tag));
      },

      // 阅读历史管理
      addToReadingHistory: (itemData) => {
        const item: ReadingHistoryItem = {
          ...itemData,
          id: `history_${Date.now()}`
        };

        set((state) => {
          // 移除相同URL的旧记录，保持历史记录唯一性
          const filteredHistory = state.readingHistory.filter(
            (historyItem) => historyItem.url !== item.url
          );
          
          // 限制历史记录数量（最多保留100条）
          const newHistory = [item, ...filteredHistory].slice(0, 100);
          
          return { readingHistory: newHistory };
        });
      },

      removeFromReadingHistory: (itemId) => {
        set((state) => ({
          readingHistory: state.readingHistory.filter((item) => item.id !== itemId)
        }));
      },

      clearReadingHistory: () => {
        set({ readingHistory: [] });
      },

      updateReadingProgress: (url, progress, readingTime) => {
        set((state) => ({
          readingHistory: state.readingHistory.map((item) =>
            item.url === url
              ? { ...item, progress, readingTime, readAt: new Date().toISOString() }
              : item
          )
        }));
      },

      // 状态管理
      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'user-store', // 持久化存储的key
      partialize: (state) => ({
        profile: state.profile,
        preferences: state.preferences,
        bookmarks: state.bookmarks,
        readingHistory: state.readingHistory
      })
    }
  )
);