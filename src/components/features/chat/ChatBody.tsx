'use client';

import { MessageCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from '@/zustand/stores/chatStore';
import { MessageList } from './MessageList';

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
  return (
    <div className="flex-1 flex flex-col bg-background relative">
      <ScrollArea className="flex-1">
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

          <MessageList
            messages={messages}
            isStreaming={isStreaming}
            streamContent={streamContent}
            onRetryMessage={onRetryMessage}
            onEditMessage={onEditMessage}
            onDeleteMessage={onDeleteMessage}
          />

          {/* 加载状态 */}
          {isLoading && !isStreaming && (
            <div className="text-xs text-muted-foreground px-6 py-2">正在生成中...</div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}