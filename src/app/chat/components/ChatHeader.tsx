'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  X,
  MessageSquare,
  Plus,
  Share2,
  Settings,
  ChevronDown,
  ChevronUp,
  Menu
} from 'lucide-react';
import { PlaceholderItem, ChatSession } from '../types';
import { mockPlaceholderData } from '../mock';
import PlaceholderTag from './PlaceholderTag';

interface ChatHeaderProps {
  promptContent: string;
  isSessionActive: boolean;
  onNewChat: () => void;

  onShowShare: () => void;
  onShowSettings: () => void;
  onShowPromptDetail: () => void;
  onClose: () => void;
  onToggleSidebar?: () => void;
  // 新增占位符相关的props
  placeholders?: PlaceholderItem[];
  // 新增session信息
  currentSession?: ChatSession | null;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  promptContent,
  isSessionActive,
  onNewChat,
  onShowShare,
  onShowSettings,
  onShowPromptDetail,
  onClose,
  onToggleSidebar,
  placeholders = mockPlaceholderData,
  currentSession
}) => {
  // 控制底部区域的展开/收起状态
  const [isExpanded, setIsExpanded] = useState(true);

  // 切换展开/收起状态
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // 根据session信息动态更新占位符值
  const getUpdatedPlaceholders = (): PlaceholderItem[] => {
    if (!currentSession) return placeholders;

    return placeholders.map((placeholder) => {
      let updatedValue = placeholder.value;

      // 根据占位符类型和session信息更新值
      switch (placeholder.type) {
        case 'language':
          updatedValue = currentSession.language || '';
          break;
        case 'version':
          updatedValue = currentSession.version || '';
          break;
        case 'product':
          updatedValue = currentSession.productCode || '';
          break;
        case 'gitCommitId':
          updatedValue = currentSession.gitCommitId || 'Dev';
          break;
        case 'fileMd5':
          updatedValue = currentSession.fileMd5 || '';
          break;
        default:
          // 保持原值
          break;
      }

      return {
        ...placeholder,
        value: updatedValue
      };
    });
  };

  // 渲染占位符预览内容
  const renderPlaceholderPreview = (placeholder: PlaceholderItem) => {
    const isImage = placeholder.type === 'img';
    const hasValue = placeholder.value && placeholder.value.trim() !== '';

    return (
      <div style={{ maxWidth: isImage ? 400 : 300 }}>
        <div style={{ fontWeight: 'bold', marginBottom: 8 }}>
          {placeholder.label}
        </div>
        <div style={{ marginBottom: 8, color: '#666' }}>
          {placeholder.description}
        </div>

        <div
          style={{
            background: '#f5f5f5',
            padding: 8,
            borderRadius: 4,
            fontFamily: 'monospace',
            fontSize: '12px',
            marginBottom: isImage && hasValue ? 8 : 0
          }}
        >
          <strong>Key:</strong> {placeholder.placeholder || placeholder.key}
          {!isImage && (
            <>
              <br />
              <strong>Value:</strong> {placeholder.value || '(空值)'}
            </>
          )}
        </div>

        {/* 图片类型的特殊处理 */}
        {isImage && hasValue && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: 4, fontSize: '12px', color: '#666' }}>
              图片预览 (点击放大):
            </div>
            <img
              src={placeholder.value}
              alt={placeholder.label}
              className="placeholder-image-preview max-w-full max-h-[200px] rounded border border-gray-300 cursor-pointer"
              onClick={() => window.open(placeholder.value, '_blank')}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMCAyMEg0NFYzNkgyMFYyMFoiIGZpbGw9IiNEOUQ5RDkiLz4KPHBhdGggZD0iTTI4IDI4SDM2VjM2SDI4VjI4WiIgZmlsbD0iI0Q5RDlEOSIvPgo8L3N2Zz4K"
              }}
            />
          </div>
        )}

        {/* 图片类型但没有值的情况 */}
        {isImage && !hasValue && (
          <div style={{ textAlign: 'center', padding: 16, color: '#999' }}>
            <div>暂无图片</div>
          </div>
        )}
      </div>
    );
  };

  // 渲染session信息
  const renderSessionInfo = () => {
    if (!currentSession) {
      return (
        <div className="mt-2">
          <span className="text-xs mr-2 text-muted-foreground">
            会话信息:
          </span>
          <span className="text-xs italic text-muted-foreground">
            暂无会话信息
          </span>
        </div>
      );
    }

    const sessionInfo = [
      { label: '语言', value: currentSession.language, color: 'blue' },
      { label: '版本', value: currentSession.version, color: 'green' },
      { label: '产品', value: currentSession.productCode, color: 'orange' },
      { label: '文档ID', value: currentSession.documentId, color: 'purple' },
      { label: '会话类型', value: currentSession.sessionType, color: 'cyan' }
    ].filter((item) => item.value); // 只显示有值的项

    if (sessionInfo.length === 0) {
      return (
        <div className="mt-2">
          <span className="text-xs mr-2 text-muted-foreground">
            会话信息:
          </span>
          <span className="text-xs italic text-muted-foreground">
            暂无绑定信息
          </span>
        </div>
      );
    }

    return (
      <div className="mt-2">
        <span className="text-xs mr-2 text-muted-foreground">
          会话信息:
        </span>
        <div className="inline-flex flex-wrap gap-1">
          {sessionInfo.map((info, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-xs"
            >
              {info.label}: {info.value}
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div className="border-b border-border-color bg-subtle-bg">
        {/* Header主体内容 */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            {/* 侧边栏切换按钮 - 仅在小屏幕显示 */}
            {onToggleSidebar && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onToggleSidebar}
                    className="md:hidden"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>切换侧边栏</TooltipContent>
              </Tooltip>
            )}

            <MessageSquare className="text-theme-primary text-xl" />
            <div className="chat-header-info">
              <h2 className="text-lg font-semibold m-0 text-theme-primary">AI Chat</h2>
              <div
                className="inline-flex items-center cursor-pointer px-1.5 py-0.5 rounded transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/5 ml-2"
                onClick={toggleExpanded}
              >
                <span className="text-xs mr-1.5 text-theme-primary">
                  {isExpanded ? '收起' : '当前系统提示词和占位符'}
                </span>
                {isExpanded ? (
                  <ChevronUp className="text-xs text-gray-500" />
                ) : (
                  <ChevronDown className="text-xs text-gray-500" />
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onNewChat}
                  className="transition-all duration-200 hover:bg-theme-primary/10 hover:text-theme-primary"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>新建对话</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onShowShare}
                  disabled={!isSessionActive}
                  className="transition-all duration-200 hover:bg-theme-primary/10 hover:text-theme-primary disabled:opacity-50"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>分享</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onShowSettings}
                  className="transition-all duration-200 hover:bg-theme-primary/10 hover:text-theme-primary"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>提示词设置</TooltipContent>
            </Tooltip>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="transition-all duration-200 hover:bg-red-50 hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </Button>
        </div>
      </div>

      {/* 可展开的底部信息区域 */}
      <div className="bg-subtle-bg">
        {/* 可展开的内容区域 */}
        {isExpanded && (
          <div className="px-4 py-2 pb-3 flex flex-col gap-1.5 border-t border-border-color bg-gray-50/50 dark:bg-gray-800/30 animate-in slide-in-from-top-2 duration-200">
            {/* 系统提示词显示 */}
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xs mr-2 text-muted-foreground">
                系统提示词:
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className="text-xs max-w-[80%] text-theme-primary cursor-pointer hover:text-theme-secondary transition-colors truncate"
                    onClick={onShowPromptDetail}
                  >
                    {promptContent}
                  </span>
                </TooltipTrigger>
                <TooltipContent>{promptContent}</TooltipContent>
              </Tooltip>
            </div>
            {/* 占位符显示 */}
            <div className="flex items-start gap-1.5">
              <span className="text-xs mr-2 text-muted-foreground">
                可用占位符:
              </span>
              <div className="flex flex-wrap gap-0.5 flex-1">
                {getUpdatedPlaceholders().map((placeholder: PlaceholderItem) => (
                  <Tooltip key={placeholder.id}>
                    <TooltipTrigger asChild>
                      <div className="inline-block">
                        <PlaceholderTag
                          placeholder={placeholder}
                          className="text-xs px-1.5 py-0.5 m-0.5 cursor-pointer hover:scale-105 transition-transform"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {renderPlaceholderPreview(placeholder)}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
            {/* session信息显示 */}
            {renderSessionInfo()}
          </div>
        )}
      </div>
      </div>
    </TooltipProvider>
  );
};

export default ChatHeader;
