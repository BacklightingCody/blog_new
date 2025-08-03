'use client';

import { useEffect, useRef } from 'react';
import { Loader2, Bot, Sparkles, MessageCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from './MessageBubble';
import { ChatMessage } from '@/zustand/stores/chatStore';
import { cn } from '@/lib/utils';

interface ChatBodyProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  isStreaming?: boolean;
  streamContent?: string;
  onRetryMessage?: (messageId: string) => void;
  onEditMessage?: (messageId: string, newContent: string) => void;
  onDeleteMessage?: (messageId: string) => void;
}

export function ChatBody({
  messages,
  isLoading = false,
  isStreaming = false,
  streamContent = '',
  onRetryMessage,
  onEditMessage,
  onDeleteMessage
}: ChatBodyProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'end'
    });
  };

  // 当有新消息或流式内容更新时滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages.length, streamContent]);

  // 渲染加载状态
  const renderLoadingState = () => (
    <div className="flex items-start gap-4 px-6 py-8 animate-in slide-in-from-bottom-4 duration-500">
      {/* AI头像 */}
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
          <Bot className="w-5 h-5" />
        </div>
      </div>

      {/* 加载内容 */}
      <div className="flex-1 max-w-4xl">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-sm font-semibold text-foreground">AI助手</span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span>正在思考</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-background to-muted/30 border border-border/50 rounded-2xl px-6 py-4 shadow-sm">
          <div className="flex items-center gap-3">
            {/* 思考动画 */}
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce"
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '1.4s'
                  }}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">AI正在分析您的问题并生成回复...</span>
          </div>
          
          {/* 进度条 */}
          <div className="mt-3 w-full bg-muted/50 rounded-full h-1 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-background relative">
      <ScrollArea ref={scrollAreaRef} className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {/* 空状态提示 */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <MessageCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">开始新的对话</h3>
              <p className="text-muted-foreground max-w-md">
                在下方输入框中输入您的问题，AI助手将为您提供帮助。
              </p>
            </div>
          )}

          {/* 消息列表 */}
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={cn(
                "animate-in slide-in-from-bottom-2 duration-500 overflow-y-auto",
                index === messages.length - 1 && "animate-in slide-in-from-bottom-4"
              )}
              style={{
                animationDelay: `${Math.min(index * 100, 300)}ms`
              }}
            >
              <MessageBubble
                message={message}
                onRetry={onRetryMessage}
                onEdit={onEditMessage}
                onDelete={onDeleteMessage}
                isStreaming={isStreaming && index === messages.length - 1}
                streamContent={streamContent}
              />
            </div>
          ))}

          {/* 加载状态 */}
          {isLoading && !isStreaming && renderLoadingState()}

          {/* 底部占位符，确保滚动到底部 */}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </ScrollArea>
    </div>
  );
}