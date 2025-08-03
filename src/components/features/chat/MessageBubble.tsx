'use client';

import { useState } from 'react';
import { Copy, RotateCcw, Edit3, Trash2, Check, User, Bot, Image as ImageIcon, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChatMessage } from '@/zustand/stores/chatStore';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: ChatMessage;
  onRetry?: (messageId: string) => void;
  onEdit?: (messageId: string, newContent: string) => void;
  onDelete?: (messageId: string) => void;
  isStreaming?: boolean;
  streamContent?: string;
}

export function MessageBubble({
  message,
  onRetry,
  onEdit,
  onDelete,
  isStreaming = false,
  streamContent = ''
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  const isSystem = message.role === 'system';

  // 复制消息内容
  const copyMessage = async () => {
    const content = typeof message.content === 'string' 
      ? message.content 
      : message.content.map(c => c.type === 'text' ? c.text : '[图片]').join(' ');
    
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 格式化时间
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 获取状态显示
  const getStatusDisplay = () => {
    switch (message.status) {
      case 'sending':
        return (
          <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
            发送中
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="destructive" className="text-xs">
            发送失败
          </Badge>
        );
      case 'canceled':
        return (
          <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-600 border-yellow-200">
            已取消
          </Badge>
        );
      default:
        return null;
    }
  };

  // 渲染消息内容
  const renderContent = () => {
    // 如果是流式输出且是当前消息
    if (isStreaming && streamContent) {
      return (
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <div className="whitespace-pre-wrap leading-relaxed">{streamContent}</div>
          <div className="inline-block w-0.5 h-5 bg-primary animate-pulse ml-1 rounded-full" />
        </div>
      );
    }

    if (typeof message.content === 'string') {
      return (
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
        </div>
      );
    }

    // 多模态内容
    return (
      <div className="space-y-4">
        {message.content.map((item, index) => (
          <div key={index}>
            {item.type === 'text' ? (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <div className="whitespace-pre-wrap leading-relaxed">{item.text}</div>
              </div>
            ) : item.type === 'image_url' && item.image_url ? (
              <div className="relative group max-w-xs">
                <img
                  src={item.image_url?.url || ''}
                  alt="用户上传的图片"
                  className="w-full h-auto max-h-64 object-contain rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-border/50"
                />
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Badge variant="secondary" className="text-xs bg-black/50 text-white border-0">
                    <ImageIcon className="w-3 h-3 mr-1" />
                    图片
                  </Badge>
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    );
  };

  // 渲染附加内容（图片、文本等）
  const renderAttachments = () => {
    if (!message.images?.length && !message.texts?.length) return null;

    return (
      <div className="mt-4 space-y-3">
        {/* 图片附件 */}
        {message.images?.map((imageUrl, index) => (
          <div key={index} className="relative group max-w-xs">
            <img
              src={imageUrl}
              alt={`附件图片 ${index + 1}`}
              className="w-full h-auto max-h-64 object-contain rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-border/50"
            />
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Badge variant="secondary" className="text-xs bg-black/50 text-white border-0">
                <ImageIcon className="w-3 h-3 mr-1" />
                附件 {index + 1}
              </Badge>
            </div>
          </div>
        ))}

        {/* 文本附件 */}
        {message.texts?.map((text, index) => (
          <div key={index} className="bg-muted/30 rounded-xl p-4 border-l-4 border-blue-500/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                <ImageIcon className="w-3 h-3 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                文本附件 {index + 1}
              </span>
            </div>
            <div className="text-sm max-h-32 overflow-y-auto bg-background/50 rounded-lg p-3 border border-border/30">
              <div className="whitespace-pre-wrap leading-relaxed">{text}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "group flex gap-4 px-6 py-6 transition-all duration-300 relative",
        isHovered && "bg-muted/20",
        isUser && "flex-row-reverse",
        isSystem && "bg-yellow-50/50 border-l-4 border-yellow-400"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 头像 */}
      <div className="flex-shrink-0">
        <Avatar className={cn(
          "w-10 h-10 border-2 shadow-lg transition-all duration-300",
          isUser 
            ? "border-blue-200 shadow-blue-100" 
            : isAssistant
            ? "border-purple-200 shadow-purple-100"
            : "border-gray-200 shadow-gray-100",
          isHovered && "scale-105"
        )}>
          <AvatarFallback className={cn(
            "font-semibold text-white",
            isUser 
              ? "bg-gradient-to-br from-blue-500 to-blue-600" 
              : isAssistant
              ? "bg-gradient-to-br from-purple-500 to-purple-600"
              : "bg-gradient-to-br from-gray-500 to-gray-600"
          )}>
            {isUser ? (
              <User className="w-5 h-5" />
            ) : isAssistant ? (
              <Bot className="w-5 h-5" />
            ) : (
              <div className="w-3 h-3 rounded-full bg-white" />
            )}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* 消息内容 */}
      <div className={cn(
        "flex-1 min-w-0 space-y-2",
        isUser && "flex flex-col items-end"
      )}>
        {/* 消息头部 */}
        <div className={cn(
          "flex items-center gap-3",
          isUser && "flex-row-reverse"
        )}>
          {/* <span className="text-sm font-semibold text-foreground">
            {isUser ? '你' : isAssistant ? 'AI助手' : '系统'}
          </span> */}
          <span className="text-xs text-muted-foreground">
            {formatTime(message.timestamp)}
          </span>
          {getStatusDisplay()}
        </div>

        {/* 消息气泡 */}
        <div className={cn(
          "relative max-w-4xl rounded-2xl px-5 py-4 shadow-sm border transition-all duration-300",
          "hover:shadow-md",
          isUser 
            ? "bg-gradient-to-br from-theme-secondary/50 to-theme-accent border-theme-primary shadow-theme-primary" 
            : isAssistant
            ? "border-border/50 shadow-theme-primary"
            : "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 shadow-yellow-100",
          message.status === 'error' && "border-destructive bg-destructive/5 shadow-destructive/10",
          isHovered && (isUser ? "shadow-theme-primary" : isAssistant ? "shadow-theme-accent" : "shadow-yellow-200")
        )}>
          {/* 系统消息标识 */}
          {isSystem && (
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-yellow-200">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <span className="text-xs font-semibold text-yellow-700">系统消息</span>
            </div>
          )}

          {renderContent()}
          {renderAttachments()}

          {/* AI消息底部操作栏 */}
          {isAssistant && (
            <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyMessage}
                  className="h-8 px-3 text-xs hover:bg-muted/80 transition-colors duration-200"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 mr-1 text-green-600" />
                      已复制
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 mr-1" />
                      复制
                    </>
                  )}
                </Button>
                
                {message.status === 'error' && onRetry && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRetry(message.id)}
                    className="h-8 px-3 text-xs hover:bg-muted/80 transition-colors duration-200"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    重试
                  </Button>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600 transition-colors duration-200"
                  title="好的回复"
                >
                  <span className="text-sm">😊</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                  title="不好的回复"
                >
                  <span className="text-sm">😞</span>
                </Button>
              </div>
            </div>
          )}

          {/* 用户消息悬浮操作栏 */}
          {isUser && (
            <div className={cn(
              "absolute -top-2 -left-2 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-1 bg-background border border-border/50 rounded-lg px-2 py-1 shadow-lg"
            )}>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyMessage}
                className="h-7 w-7 p-0 hover:bg-muted/80 transition-colors duration-200"
                title={copied ? "已复制" : "复制"}
              >
                {copied ? (
                  <Check className="w-3 h-3 text-green-600" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 hover:bg-muted/80 transition-colors duration-200"
                  >
                    <MoreHorizontal className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-36">
                  {onEdit && (
                    <DropdownMenuItem 
                      onClick={() => onEdit(message.id, typeof message.content === 'string' ? message.content : '')}
                      className="text-sm"
                    >
                      <Edit3 className="w-3 h-3 mr-2" />
                      编辑
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem 
                      onClick={() => onDelete(message.id)}
                      className="text-sm text-destructive focus:text-destructive"
                    >
                      <Trash2 className="w-3 h-3 mr-2" />
                      删除
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>

      {/* 连接线（可选装饰） */}
      {!isUser && (
        <div className="absolute left-14 top-16 w-px h-6 bg-gradient-to-b from-border/50 to-transparent opacity-30" />
      )}
    </div>
  );
}