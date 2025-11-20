'use client';

import { useEffect, useRef } from 'react';
import { ChatMessage } from '@/zustand/stores/chatStore';
import { MessageBubble } from './MessageBubble';

interface MessageListProps {
  messages: ChatMessage[];
  isStreaming?: boolean;
  streamContent?: string;
  onRetryMessage?: (messageId: string) => void;
  onEditMessage?: (messageId: string, newContent: string) => void;
  onDeleteMessage?: (messageId: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

export function MessageList({
  messages,
  isStreaming = false,
  streamContent = '',
  onRetryMessage,
  onEditMessage,
  onDeleteMessage,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length, streamContent]);

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div key={message.id}>
          <MessageBubble
            message={message}
            onRetry={onRetryMessage}
            onEdit={onEditMessage}
            onDelete={onDeleteMessage}
            isStreaming={false}
            streamContent={''}
          />
        </div>
      ))}

      {isStreaming && (
        <div>
          <MessageBubble
            message={{
              id: `streaming_${messages[messages.length - 1]?.id || 'temp'}`,
              role: 'assistant',
              content: streamContent || '',
              timestamp: new Date().toISOString(),
              status: 'sending',
            }}
            isStreaming={true}
            streamContent={streamContent}
          />
        </div>
      )}

      <div ref={messagesEndRef} className="h-2" />
    </div>
  );
}


