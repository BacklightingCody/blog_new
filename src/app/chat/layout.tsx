'use client';

import { useState, useEffect } from 'react';
import { useChatStore } from '@/zustand/stores/chatStore';
import { ChatSidebar, ChatHeader, ChatBody, ChatInput, ChatSettings, ModelCompareSwitch } from '@/components/features/chat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AVAILABLE_MODELS } from '@/constants/chat';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // 对比开关联动侧边栏（基于全局开关）将在获取 store 后设置
  
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
    deleteSystemPrompt,
    isModelCompareEnabled,
    compareModels,
    toggleModelCompare,
    setCompareModels,
    compareStreaming,
    compareStreamContentByModel
  } = useChatStore();

  const currentSession = getCurrentSession();

  // 对比开关联动侧边栏（基于全局开关）
  useEffect(() => {
    if (isModelCompareEnabled) setSidebarCollapsed(true);
  }, [isModelCompareEnabled]);

  // 处理显示设置
  const handleShowSettings = () => {
    setShowSettings(true);
  };

  // 处理关闭设置
  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  // 提示词与模型设置直接下发 store 方法，避免中间包装

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* 左侧边栏 */}
      <ChatSidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        onCreateSession={() => createSession()}
        onSelectSession={(id) => setCurrentSession(id)}
        onDeleteSession={(id) => deleteSession(id)}
        onRenameSession={(id, name) => updateSessionName(id, name)}
        onTogglePin={(id) => toggleSessionPin(id)}
        onChangeSessionType={(id, type) => changeSessionType(id, type)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
      />

      {/* 主要内容区域 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 头部 */}
        <ChatHeader
          currentSession={currentSession}
          onClearMessages={() => currentSession && clearSessionMessages(currentSession.id)}
          onShowSettings={handleShowSettings}
          onShareSession={() => console.log('分享会话')}
          onExportSession={() => console.log('导出会话')}
          onToggleSidebar={() => setSidebarCollapsed((v) => !v)}
        />

        {/* 顶部工具栏：对比模式开关（仅控制模式与模型选择） */}
        <div className="px-4 py-2 border-b flex items-center gap-3">
          <ModelCompareSwitch
            enabled={isModelCompareEnabled}
            selectedModels={compareModels}
            onToggle={(enabled) => {
              toggleModelCompare(enabled);
            }}
            onSelectModels={(models) => setCompareModels(models)}
          />
        </div>

        {/* 主区域：对比模式 -> 渲染 X 个 ChatBody 列；普通模式 -> 单列 */}
        <div className="flex-1 overflow-y-auto p-4">
          {isModelCompareEnabled && compareModels.length > 0 ? (
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: `repeat(${Math.max(compareModels.length, 1)}, minmax(0, 1fr))`,
              }}
            >
              {compareModels.map((model) => {
                const friendly = AVAILABLE_MODELS.find((m) => m.value === model)?.name || model;
                const columnMessages = currentSession?.messagesByModel?.[model] || [];
                const streamCol = compareStreamContentByModel?.[model] || '';
                return (
                  <div key={model} className="rounded-xl border bg-background overflow-hidden">
                    <div className="px-4 py-2 border-b text-sm font-medium flex items-center justify-between">
                      <span>{friendly}</span>
                      <span className="text-xs text-muted-foreground">{model}</span>
                    </div>
                    <ScrollArea className="max-h-[70vh]">
                      <div className="p-3">
                        <ChatBody
                          messages={columnMessages}
                          isLoading={loading}
                          isStreaming={compareStreaming}
                          streamContent={streamCol}
                          onRetryMessage={(messageId) => retryMessage(messageId)}
                          onEditMessage={(messageId, content) => currentSession && editMessage(currentSession.id, messageId, content)}
                          onDeleteMessage={(messageId) => currentSession && deleteMessage(currentSession.id, messageId)}
                        />
                      </div>
                    </ScrollArea>
                  </div>
                );
              })}
            </div>
          ) : (
            <ChatBody
              messages={currentSession?.messages || []}
              isLoading={loading}
              isStreaming={streaming}
              streamContent={streamContent}
              onRetryMessage={(messageId) => retryMessage(messageId)}
              onEditMessage={(messageId, content) => currentSession && editMessage(currentSession.id, messageId, content)}
              onDeleteMessage={(messageId) => currentSession && deleteMessage(currentSession.id, messageId)}
            />
          )}
        </div>

        {/* 输入区域 - 复用同一输入框（对比逻辑在 store 内部处理） */}
        <div className="flex-shrink-0 border-t bg-background">
          <ChatInput
            onSendMessage={(req) => sendMessage(req)}
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
        onModelConfigChange={updateModelConfig}
        systemPrompts={systemPrompts}
        selectedPromptId={selectedPromptId}
        onPromptSelect={selectPrompt}
        onPromptSave={addSystemPrompt}
        onPromptUpdate={updateSystemPrompt}
        onPromptDelete={deleteSystemPrompt}
      />
    </div>
  );
}