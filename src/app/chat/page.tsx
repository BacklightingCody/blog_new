'use client'
import React, { useState, useEffect } from 'react';
import { useChatManager } from './hooks/useChatManager';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus, Trash2, Share2, Settings, PanelLeftClose, PanelLeft, MessageSquare } from 'lucide-react';


import ChatBody from './components/ChatBody';
import ChatInput from './components/ChatInput';

import SettingsModal from './components/SettingsModal';
import ShareModal from './components/ShareModal';
import PromptDetailModal from './components/PromptDetailModal';

const Chat: React.FC = () => {
  // 统一 UI 状态管理
  const [uiState, setUiState] = useState({
    showHistory: false,
    showSettings: false,
    showShare: false,
    showPromptDetail: false,
    sidebarCollapsed: false
  });

  const UI_TYPES = {
    HISTORY: 'showHistory',
    SETTINGS: 'showSettings',
    SHARE: 'showShare',
    PROMPT_DETAIL: 'showPromptDetail'
  } as const;

  const toggleUIState = (type: keyof typeof uiState, status: boolean) => {
    setUiState((prev) => ({ ...prev, [type]: status }));
  };

  const chatManager = useChatManager();

  // 删除会话的确认处理
  const handleDeleteSession = (sessionId: string) => {
    const session = chatManager.sessions.find((s) => s.id === sessionId);
    if (session) {
      chatManager.deleteSession(sessionId);
      console.log(`已删除会话: ${session.name}`);

      // 如果删除的是当前会话，自动创建新会话
      if (sessionId === chatManager.currentSessionId) {
        const newSession = chatManager.createSession();
        console.log(`已自动创建新会话: ${newSession.name}`);
      }
    }
  };

  // 处理分享功能
  const handleShare = () => {
    const currentSession = chatManager.getCurrentSession();
    if (!currentSession || currentSession.messages.length === 0) {
      console.warn('当前会话没有可分享的内容');
      return;
    }
    toggleUIState(UI_TYPES.SHARE, true);
  };

  // 处理提示词编辑
  const handlePromptEdit = () => {
    const currentPrompt = chatManager.getCurrentPrompt();
    chatManager.startEditPrompt(currentPrompt.id);
    toggleUIState(UI_TYPES.PROMPT_DETAIL, false);
    toggleUIState(UI_TYPES.SETTINGS, true);
  };

  return (
    <TooltipProvider>
      <div className="h-full w-full flex bg-theme-primary/10">
        {/* 左侧边栏 - ChatGPT 风格 */}
        <div className={`${uiState.sidebarCollapsed ? 'w-16' : 'w-64'} border-r border-border flex flex-col transition-all duration-300`}>
          {/* 侧边栏顶部按钮区域 */}
          <div className="p-3 space-y-1">
            {/* 新建对话 */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => chatManager.createSession()}
                  className={`w-full ${uiState.sidebarCollapsed ? 'px-2 justify-center' : 'justify-start'} gap-2 h-10 hover:bg-theme-accent hover:font-bold bg-theme-accent/10 border-none dark:hover:bg-theme-accent`}
                  variant="ghost"
                >
                  <Plus className="h-4 w-4" />
                  {!uiState.sidebarCollapsed && '新建对话'}
                </Button>
              </TooltipTrigger>
              {uiState.sidebarCollapsed && <TooltipContent side="right">新建对话</TooltipContent>}
            </Tooltip>

            {/* 分享按钮 */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleShare}
                  disabled={!chatManager.getCurrentSession()}
                  className={`w-full ${uiState.sidebarCollapsed ? 'px-2 justify-center' : 'justify-start'} gap-2 h-10 hover:bg-theme-accent hover:font-bold dark:hover:bg-theme-accent`}
                  variant="ghost"
                >
                  <Share2 className="h-4 w-4" />
                  {!uiState.sidebarCollapsed && '分享对话'}
                </Button>
              </TooltipTrigger>
              {uiState.sidebarCollapsed && <TooltipContent side="right">分享对话</TooltipContent>}
            </Tooltip>

            {/* 设置按钮 */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => {
                    toggleUIState(UI_TYPES.SETTINGS, true);
                    chatManager.cancelEditPrompt();
                  }}
                  className={`w-full ${uiState.sidebarCollapsed ? 'px-2 justify-center' : 'justify-start'} gap-2 h-10 hover:bg-theme-accent hover:font-bold dark:hover:bg-theme-accent`}
                  variant="ghost"
                >
                  <Settings className="h-4 w-4" />
                  {!uiState.sidebarCollapsed && 'AI 设置'}
                </Button>
              </TooltipTrigger>
              {uiState.sidebarCollapsed && <TooltipContent side="right">AI 设置</TooltipContent>}
            </Tooltip>

            {/* 收起/展开按钮 */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => toggleUIState('sidebarCollapsed', !uiState.sidebarCollapsed)}
                  className={`w-full ${uiState.sidebarCollapsed ? 'px-2 justify-center' : 'justify-start'} gap-2 h-10 hover:bg-theme-accent hover:font-bold dark:hover:bg-theme-accent`}
                  variant="ghost"
                >
                  {uiState.sidebarCollapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                  {!uiState.sidebarCollapsed && '收起侧边栏'}
                </Button>
              </TooltipTrigger>
              {uiState.sidebarCollapsed && <TooltipContent side="right">展开侧边栏</TooltipContent>}
            </Tooltip>
          </div>

          {/* 分隔线 */}
          <div className="border-t border-gray-200 dark:border-gray-700 mx-3" />

          {/* 收起状态下的会话指示器 */}
          {uiState.sidebarCollapsed && chatManager.sessions.length > 0 && (
            <div className="px-3 py-2">
              {chatManager.sessions.slice(0, 3).map((session) => (
                <Tooltip key={session.id}>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => chatManager.setCurrentSession(session.id)}
                      className={`w-full h-10 mb-1 px-2 justify-center ${session.id === chatManager.currentSessionId
                        ? 'bg-theme-accent hover:bg-theme-accent'
                        : 'hover:bg-theme-accent dark:hover:bg-theme-accent'
                        }`}
                      variant="ghost"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">{session.name}</TooltipContent>
                </Tooltip>
              ))}
              {chatManager.sessions.length > 3 && (
                <div className="text-center text-xs mt-1">
                  +{chatManager.sessions.length - 3}
                </div>
              )}
            </div>
          )}

          {/* 会话列表 */}
          {!uiState.sidebarCollapsed && (
            <div className="flex-1 overflow-y-auto px-3 pb-3">
              <div className="space-y-1">
                {chatManager.sessions.length > 0 && (
                  <div className="font-bold text-theme-primary mb-2 px-2">
                    最近对话
                  </div>
                )}
                {chatManager.sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${session.id === chatManager.currentSessionId
                      ? 'bg-theme-accent dark:bg-theme-accent'
                      : 'hover:bg-theme-accent'
                      }`}
                    onClick={() => chatManager.setCurrentSession(session.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {session.name}
                      </div>
                      <div className="text-xs mt-1">
                        {new Date(session.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`确定要删除会话 "${session.name}" 吗？`)) {
                          handleDeleteSession(session.id);
                        }
                      }}
                      className="cursor-pointer opacity-0 group-hover:opacity-100 h-6 w-6 p-0 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {chatManager.sessions.length === 0 && (
                  <div className="text-center py-8 text-sm">
                    暂无历史会话
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 主内容区域 */}
        <div className="flex-1 flex flex-col">
          {/* 简化的头部 - ChatGPT 风格 */}
          <div className="border-b border-theme-accent dark:border-theme-accent px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  {chatManager.getCurrentSession()?.name || 'ChatGPT'}
                </h1>
                {chatManager.getCurrentSession() && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {chatManager.getCurrentSession()?.messages?.length || 0} 条消息
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleUIState(UI_TYPES.PROMPT_DETAIL, true)}
                className="cursor-pointer text-sm hover:text-theme-primary "
              >
                查看提示词
              </Button>
            </div>
          </div>

          <div className="flex flex-col flex-1">
            <div className="flex-1 overflow-y-auto">
              <ChatBody
                session={chatManager.getCurrentSession()}
                loading={chatManager.loading}
                streaming={chatManager.streaming}
                streamContent={chatManager.streamContent}
                onSendMessage={chatManager.sendMessage}
                onRetryMessage={chatManager.retryMessage}
              />
            </div>
            <div className="">
              <ChatInput
                onSend={chatManager.sendMessage}
                onCancel={chatManager.cancelRequest}
                loading={chatManager.loading}
                currentModel={chatManager.modelConfig.model}
                modelConfig={chatManager.modelConfig}
                onModelConfigChange={chatManager.updateModelConfig}
                getAvailableModels={chatManager.getAvailableModels}
              />
            </div>
          </div>



        </div>



        {/* Settings Modal */}
        <SettingsModal
          open={uiState.showSettings}
          onClose={() => {
            toggleUIState(UI_TYPES.SETTINGS, false);
            chatManager.cancelEditPrompt();
          }}
          systemPrompts={chatManager.systemPrompts}
          selectedPromptId={chatManager.selectedPromptId}
          onSelectPrompt={chatManager.setSystemPrompt}
          onSavePrompt={(values) => chatManager.saveSystemPrompt({ ...values, isDefault: false })}
          onUpdatePrompt={(id, values) => chatManager.updateSystemPrompt(id, values)}
          onDeletePrompt={chatManager.deleteSystemPrompt}
          editingPromptId={chatManager.editingPromptId}
          onStartEdit={chatManager.startEditPrompt}
          onCancelEdit={chatManager.cancelEditPrompt}
        />

        {/* Share Modal */}
        <ShareModal
          open={uiState.showShare}
          onClose={() => toggleUIState(UI_TYPES.SHARE, false)}
          session={chatManager.getCurrentSession()}
        />

        {/* Prompt Detail Modal */}
        <PromptDetailModal
          open={uiState.showPromptDetail}
          onClose={() => toggleUIState(UI_TYPES.PROMPT_DETAIL, false)}
          prompt={chatManager.getCurrentPrompt()}
          onEdit={handlePromptEdit}
        />
      </div>
    </TooltipProvider>
  );
};

export default Chat;
