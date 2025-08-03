'use client';

import { useState } from 'react';
import { useChatStore } from '@/zustand/stores/chatStore';
import { ChatSidebar, ChatHeader, ChatBody, ChatInput, ChatSettings } from '@/components/features/chat';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSettings, setShowSettings] = useState(false);
  
  const {
    sessions,
    currentSessionId,
    getCurrentSession,
    createSession,
    deleteSession,
    setCurrentSession,
    updateSessionName,
    toggleSessionPin,
    changeSessionType,
    sendMessage,
    retryMessage,
    deleteMessage,
    editMessage,
    clearSessionMessages,
    loading,
    streaming,
    streamContent,
    cancelRequest,
    modelConfig,
    updateModelConfig,
    systemPrompts,
    selectedPromptId,
    selectPrompt,
    addSystemPrompt,
    updateSystemPrompt,
    deleteSystemPrompt
  } = useChatStore();

  const currentSession = getCurrentSession();

  // 处理创建新会话
  const handleCreateSession = () => {
    createSession();
  };

  // 处理选择会话
  const handleSelectSession = (sessionId: string) => {
    setCurrentSession(sessionId);
  };

  // 处理删除会话
  const handleDeleteSession = (sessionId: string) => {
    deleteSession(sessionId);
  };

  // 处理重命名会话
  const handleRenameSession = (sessionId: string, newName: string) => {
    updateSessionName(sessionId, newName);
  };

  // 处理置顶会话
  const handleTogglePin = (sessionId: string) => {
    toggleSessionPin(sessionId);
  };

  // 处理会话类型切换
  const handleChangeSessionType = (sessionId: string, sessionType: 'public' | 'private') => {
    changeSessionType(sessionId, sessionType);
  };

  // 处理清空消息
  const handleClearMessages = () => {
    if (currentSession) {
      clearSessionMessages(currentSession.id);
    }
  };

  // 处理发送消息
  const handleSendMessage = async (request: any) => {
    await sendMessage(request);
  };

  // 处理重试消息
  const handleRetryMessage = async (messageId: string) => {
    await retryMessage(messageId);
  };

  // 处理编辑消息
  const handleEditMessage = (messageId: string, newContent: string) => {
    if (currentSession) {
      editMessage(currentSession.id, messageId, newContent);
    }
  };

  // 处理删除消息
  const handleDeleteMessage = (messageId: string) => {
    if (currentSession) {
      deleteMessage(currentSession.id, messageId);
    }
  };

  // 处理显示设置
  const handleShowSettings = () => {
    setShowSettings(true);
  };

  // 处理关闭设置
  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  // 处理模型配置更新
  const handleModelConfigChange = (config: Partial<typeof modelConfig>) => {
    updateModelConfig(config);
  };

  // 处理提示词选择
  const handlePromptSelect = (promptId: string) => {
    selectPrompt(promptId);
  };

  // 处理保存新提示词
  const handlePromptSave = (prompt: Omit<any, 'id'>) => {
    addSystemPrompt(prompt);
  };

  // 处理更新提示词
  const handlePromptUpdate = (promptId: string, updates: Partial<any>) => {
    updateSystemPrompt(promptId, updates);
  };

  // 处理删除提示词
  const handlePromptDelete = (promptId: string) => {
    deleteSystemPrompt(promptId);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* 左侧边栏 */}
      <ChatSidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        onCreateSession={handleCreateSession}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        onRenameSession={handleRenameSession}
        onTogglePin={handleTogglePin}
        onChangeSessionType={handleChangeSessionType}
      />

      {/* 主要内容区域 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 头部 */}
        <ChatHeader
          currentSession={currentSession}
          onClearMessages={handleClearMessages}
          onShowSettings={handleShowSettings}
          onShareSession={() => console.log('分享会话')}
          onExportSession={() => console.log('导出会话')}
        />

        {/* 消息区域 */}
        <div className="flex-1 overflow-y-auto">
          <ChatBody
            messages={currentSession?.messages || []}
            isLoading={loading}
            isStreaming={streaming}
            streamContent={streamContent}
            onRetryMessage={handleRetryMessage}
            onEditMessage={handleEditMessage}
            onDeleteMessage={handleDeleteMessage}
          />
        </div>

        {/* 输入区域 - 固定在底部 */}
        <div className="flex-shrink-0 border-t bg-background">
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={loading}
            onCancelRequest={cancelRequest}
            disabled={!currentSession}
          />
        </div>
      </div>

      {/* 设置弹窗 */}
      <ChatSettings
        isOpen={showSettings}
        onClose={handleCloseSettings}
        modelConfig={modelConfig}
        onModelConfigChange={handleModelConfigChange}
        systemPrompts={systemPrompts}
        selectedPromptId={selectedPromptId}
        onPromptSelect={handlePromptSelect}
        onPromptSave={handlePromptSave}
        onPromptUpdate={handlePromptUpdate}
        onPromptDelete={handlePromptDelete}
      />
    </div>
  );
}