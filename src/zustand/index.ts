/**
 * Zustand 状态管理统一导出
 * 整合所有状态管理模块
 */

// 导出所有stores
export { useThemeStore } from './stores/themeStore';
export { useUserStore } from './stores/userStore';
export { useAppStore } from './stores/appStore';
export { useChatStore } from './stores/chatStore';

// 导出类型定义
export type { UserPreferences, UserProfile, Bookmark, ReadingHistoryItem } from './stores/userStore';
export type { NotificationType, Notification, SearchResult } from './stores/appStore';
export type { 
  ChatMessage, 
  ChatSession, 
  SystemPrompt, 
  ModelConfig, 
  SendMessageRequest,
  PlaceholderItem,
  MessageContent,
  OpenAIMessage,
  ChatCompletionRequest
} from './stores/chatStore';

// 导出便捷的选择器hooks
export const useAuth = () => {
  const { useUserStore } = require('./stores/userStore');
  return useUserStore((state: any) => ({
    user: state.profile,
    isAuthenticated: !!state.profile,
    login: state.setProfile,
    logout: () => state.setProfile(null),
  }));
};

export const useUserPreferences = () => {
  const { useUserStore } = require('./stores/userStore');
  return useUserStore((state: any) => ({
    preferences: state.preferences,
    updatePreferences: state.updatePreferences,
  }));
};

export const useBookmarks = () => {
  const { useUserStore } = require('./stores/userStore');
  return useUserStore((state: any) => ({
    bookmarks: state.bookmarks,
    addBookmark: state.addBookmark,
    removeBookmark: state.removeBookmark,
    isBookmarked: state.isBookmarked,
  }));
};

export const useReadingHistory = () => {
  const { useUserStore } = require('./stores/userStore');
  return useUserStore((state: any) => ({
    history: state.readingHistory,
    addToHistory: state.addToReadingHistory,
    clearHistory: state.clearReadingHistory,
  }));
};

export const useGlobalLoading = () => {
  const { useAppStore } = require('./stores/appStore');
  return useAppStore((state: any) => ({
    isLoading: state.isLoading,
    setLoading: state.setLoading,
  }));
};

export const useNotifications = () => {
  const { useAppStore } = require('./stores/appStore');
  return useAppStore((state: any) => ({
    notifications: state.notifications,
    addNotification: state.addNotification,
    removeNotification: state.removeNotification,
    clearNotifications: state.clearNotifications,
  }));
};

export const useSearchState = () => {
  const { useAppStore } = require('./stores/appStore');
  return useAppStore((state: any) => ({
    searchQuery: state.searchQuery,
    searchResults: state.searchResults,
    isSearching: state.isSearching,
    setSearchQuery: state.setSearchQuery,
    setSearchResults: state.setSearchResults,
    setIsSearching: state.setIsSearching,
    clearSearch: state.clearSearch,
  }));
};

// 导出主题相关的选择器
export const useTheme = () => {
  const { useThemeStore } = require('./stores/themeStore');
  return useThemeStore((state: any) => ({
    theme: state.theme,
    setTheme: state.setTheme,
    toggleTheme: state.toggleTheme,
  }));
};

// 导出Chat相关的选择器
export const useChatSessions = () => {
  const { useChatStore } = require('./stores/chatStore');
  return useChatStore((state: any) => ({
    sessions: state.sessions,
    currentSessionId: state.currentSessionId,
    currentSession: state.getCurrentSession(),
    createSession: state.createSession,
    deleteSession: state.deleteSession,
    setCurrentSession: state.setCurrentSession,
  }));
};

export const useChatMessages = () => {
  const { useChatStore } = require('./stores/chatStore');
  return useChatStore((state: any) => ({
    sendMessage: state.sendMessage,
    retryMessage: state.retryMessage,
    deleteMessage: state.deleteMessage,
    editMessage: state.editMessage,
    loading: state.loading,
    streaming: state.streaming,
    streamContent: state.streamContent,
    cancelRequest: state.cancelRequest,
  }));
};

export const useChatConfig = () => {
  const { useChatStore } = require('./stores/chatStore');
  return useChatStore((state: any) => ({
    modelConfig: state.modelConfig,
    updateModelConfig: state.updateModelConfig,
    systemPrompts: state.systemPrompts,
    selectedPromptId: state.selectedPromptId,
    setSystemPrompt: state.setSystemPrompt,
    getCurrentPrompt: state.getCurrentPrompt,
  }));
};