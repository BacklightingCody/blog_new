'use client';

import { useChatStore } from '@/zustand/stores/chatStore';
import { AVAILABLE_MODELS, getGroupedModels, modelSupportsImage } from '@/constants/chat';

/**
 * Chat管理器Hook - 提供统一的chat状态管理接口
 * 这个hook封装了chatStore的复杂逻辑，为组件提供简洁的API
 */
export function useChatManager() {
  // 获取store中的所有状态和方法
  const store = useChatStore();

  // 扩展的工具方法
  const getAvailableModels = (hasImage?: boolean) => {
    if (hasImage !== undefined) {
      // 如果指定了 hasImage 参数，返回过滤后的平铺列表（保持向后兼容）
      return AVAILABLE_MODELS.filter((model) => !hasImage || model.supportsImage);
    }

    // 如果没有指定参数，返回分组数据
    return getGroupedModels();
  };

  const isModelSupportsImage = (modelValue: string): boolean => {
    return modelSupportsImage(modelValue);
  };

  // 获取当前会话的统计信息
  const getCurrentSessionStats = () => {
    const currentSession = store.getCurrentSession();
    if (!currentSession) {
      return {
        messageCount: 0,
        userMessageCount: 0,
        assistantMessageCount: 0,
        lastMessageTime: null
      };
    }

    const userMessages = currentSession.messages.filter(m => m.role === 'user');
    const assistantMessages = currentSession.messages.filter(m => m.role === 'assistant');
    const lastMessage = currentSession.messages[currentSession.messages.length - 1];

    return {
      messageCount: currentSession.messages.length,
      userMessageCount: userMessages.length,
      assistantMessageCount: assistantMessages.length,
      lastMessageTime: lastMessage?.timestamp || null
    };
  };

  // 检查是否可以发送消息
  const canSendMessage = (content: string): boolean => {
    if (!content.trim()) return false;
    if (store.loading || store.streaming) return false;
    return true;
  };

  // 获取会话摘要
  const getSessionSummary = (sessionId: string) => {
    const session = store.sessions.find(s => s.id === sessionId);
    if (!session) return null;

    const messageCount = session.messages.length;
    const lastMessage = session.messages[session.messages.length - 1];
    const firstUserMessage = session.messages.find(m => m.role === 'user');

    return {
      id: session.id,
      name: session.name,
      messageCount,
      lastMessageTime: lastMessage?.timestamp,
      firstUserMessage: firstUserMessage?.content,
      sessionType: session.sessionType,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt
    };
  };

  // 导出会话数据
  const exportSession = (sessionId: string) => {
    const session = store.sessions.find(s => s.id === sessionId);
    if (!session) return null;

    return {
      session,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
  };

  // 导出所有会话数据
  const exportAllSessions = () => {
    return {
      sessions: store.sessions,
      systemPrompts: store.systemPrompts,
      modelConfig: store.modelConfig,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
  };

  // 清空当前会话的消息
  const clearCurrentSessionMessages = () => {
    const currentSession = store.getCurrentSession();
    if (!currentSession) return;

    // 删除当前会话的所有消息
    currentSession.messages.forEach(message => {
      store.deleteMessage(currentSession.id, message.id);
    });
  };

  // 返回完整的API
  return {
    // 基础状态
    sessions: store.sessions,
    currentSessionId: store.currentSessionId,
    currentSession: store.getCurrentSession(),
    systemPrompts: store.systemPrompts,
    selectedPromptId: store.selectedPromptId,
    editingPromptId: store.editingPromptId,
    modelConfig: store.modelConfig,
    loading: store.loading,
    streaming: store.streaming,
    streamContent: store.streamContent,
    error: store.error,

    // 会话管理方法
    createSession: store.createSession,
    deleteSession: store.deleteSession,
    setCurrentSession: store.setCurrentSession,
    getCurrentSession: store.getCurrentSession,
    updateSessionName: store.updateSessionName,

    // 消息管理方法
    sendMessage: store.sendMessage,
    retryMessage: store.retryMessage,
    deleteMessage: store.deleteMessage,
    editMessage: store.editMessage,

    // 系统提示词管理方法
    getCurrentPrompt: store.getCurrentPrompt,
    selectPrompt: store.selectPrompt,
    addSystemPrompt: store.addSystemPrompt,
    updateSystemPrompt: store.updateSystemPrompt,
    deleteSystemPrompt: store.deleteSystemPrompt,
    duplicateSystemPrompt: store.duplicateSystemPrompt,
    startEditPrompt: store.startEditPrompt,
    cancelEditPrompt: store.cancelEditPrompt,

    // 配置管理方法
    updateModelConfig: store.updateModelConfig,

    // 控制方法
    cancelRequest: store.cancelRequest,
    clearError: store.clearError,

    // 工具方法
    buildOpenAIMessages: store.buildOpenAIMessages,
    extractTextFromContent: store.extractTextFromContent,
    classifyError: store.classifyError,

    // 扩展的工具方法
    getAvailableModels,
    isModelSupportsImage,
    getCurrentSessionStats,
    canSendMessage,
    getSessionSummary,
    exportSession,
    exportAllSessions,
    clearCurrentSessionMessages,

    // 便捷方法（为了保持向后兼容）
    handleSend: store.sendMessage, // 别名
  };
}