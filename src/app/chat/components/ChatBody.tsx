'use client'
import React, { useEffect, useRef, useState } from 'react';
import {
  ChatSession,
  ChatMessage,
  SendMessageRequest,
  MessageContent
} from '../types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import CustomBubble from './CustomBubble';
import {
  Copy,
  RotateCcw,
  Share2,
  Edit3,
  User,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
// 简单的 ActionItem 类型定义
interface ActionItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  onItemClick: () => void;
}



// 流式显示组件
const StreamingBubble: React.FC<{
  content: string;
  loading: boolean;
  typing: boolean;
  avatar: { icon: React.ReactElement; style: { background: string } };
  onComplete?: () => void;
}> = ({ content, loading, typing, avatar, onComplete }) => {
  // 简化：直接根据 typing 状态判断是否完成
  useEffect(() => {
    if (!typing && content && onComplete) {
      onComplete();
    }
  }, [typing, content, onComplete]);

  // 使用自定义组件替代 Bubble
  return (
    <div className="streaming-content">
      <CustomBubble
        content={content || (loading ? "正在思考中..." : "")}
        placement="start"
        avatar={avatar}
        typing={typing}
        loading={loading}
      />
    </div>
  );
};

// 工具函数：提取消息的文本内容
const extractTextContent = (content: string | MessageContent[]): string => {
  if (typeof content === 'string') {
    return content;
  }

  return content
    .filter((item) => item.type === 'text')
    .map((item) => item.text)
    .join(' ');
};

// 工具函数：检查消息是否包含图片
const hasImages = (content: string | MessageContent[]): boolean => {
  if (typeof content === 'string') {
    return false;
  }

  return content.some((item) => item.type === 'image_url');
};

interface MessageItemProps {
  message: ChatMessage & {
    isLastAssistantMessage?: boolean; // 标记是否为当前会话的最后一条AI消息
  };
  onEdit?: (id: string, newContent: string) => void;
  onRetry?: (userContent: string) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, onEdit, onRetry }) => {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(extractTextContent(message.content));
  const [shareOpen, setShareOpen] = useState(false);

  const handleCopy = async () => {
    try {
      const textContent = extractTextContent(message.content);
      console.log('Copying message content:', textContent);
      await navigator.clipboard.writeText(textContent);
      console.log('已复制到剪贴板');
    } catch (err) {
      console.error('复制失败，请重试', err);
    }
  };
  // console.log(message, 'message');
  const handleEdit = () => {
    setEditing(true);
    setEditValue(extractTextContent(message.content));
  };

  const handleEditSave = () => {
    console.log(message?.id, editValue);
    // 这里编辑后需要支持可以重新发送
    if (onEdit && message.id) onEdit(message?.id, editValue);
    setEditing(false);
  };

  const handleRetry = () => {
    // 这里需要把当前item的content或者id传给ChatBoby父组件
    if (onRetry && message.id) onRetry(message?.id);
  };

  const handleShare = () => {
    setShareOpen(true);
  };

  const handleLike = () => {
    console.log('最佳回复');
  };

  const handleUnlike = () => {
    console.log('错误回复');
  };

  const userActionItems: ActionItem[] = [
    {
      key: 'copy',
      icon: <Copy className="h-4 w-4" />,
      label: 'Copy',
      onItemClick: handleCopy
    },
    {
      key: 'edit',
      icon: <Edit3 className="h-4 w-4" />,
      label: 'Edit',
      onItemClick: handleEdit
    }
  ];

  const aiActionItems: ActionItem[] = [
    {
      key: 'copy',
      icon: <Copy className="h-4 w-4" />,
      label: 'Copy',
      onItemClick: handleCopy
    },
    ...(message.isLastAssistantMessage
      ? [
          {
            key: 'retry',
            icon: <RotateCcw className="h-4 w-4" />,
            label: 'Retry',
            onItemClick: handleRetry
          }
        ]
      : []),
    {
      key: 'share',
      icon: <Share2 className="h-4 w-4" />,
      label: 'Share',
      onItemClick: handleShare
    },
    {
      key: 'good',
      icon: <ThumbsUp className="h-4 w-4" />,
      label: '最佳回复',
      onItemClick: handleLike
    },
    {
      key: 'bad',
      icon: <ThumbsDown className="h-4 w-4" />,
      label: '错误回复',
      onItemClick: handleUnlike
    }
  ];

  return (
    <div style={{ marginBottom: 12 }}>
      {editing ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Textarea
            value={editValue}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditValue(e.target.value)}
            rows={2}
            className="flex-1"
          />
          <Button size="sm" onClick={handleEditSave}>
            重新发送
          </Button>
          <Button variant="outline" size="sm" onClick={() => setEditing(false)}>
            取消
          </Button>
        </div>
      ) : (
        <div>
          {/* 对于取消状态的assistant消息，使用CustomBubble显示 */}
          {message.role === 'assistant' && message.status === 'canceled' ? (
            <div className="canceled-content">
              <CustomBubble
                content={extractTextContent(message.content)}
                placement="start"
                avatar={{ icon: <User className="h-4 w-4" />, style: { background: '#fdcb6e' } }}
                typing={false}
                loading={false}
                customStyle={{
                  borderColor: '#faad14',
                  backgroundColor: '#fffbe6'
                }}
              />
            </div>
          ) : (
            <CustomBubble
              content={extractTextContent(message.content)}
              placement={message.role === 'user' ? 'end' : 'start'}
              avatar={
                message.role === 'user'
                  ? { icon: <User className="h-4 w-4" />, style: { background: '#87d068' } }
                  : { icon: <User className="h-4 w-4" />, style: { background: '#fdcb6e' } }
              }
              loading={message.status === 'sending'}
              customStyle={
                message.status === 'error'
                  ? { borderColor: '#ff4d4f' }
                  : undefined
              }
            />
          )}
          {/* 显示取消状态指示器 */}
          {message.status === 'canceled' && (
            <div
              style={{
                marginTop: 4,
                fontSize: '12px',
                color: '#faad14',
                fontStyle: 'italic',
                textAlign: message.role === 'user' ? 'right' : 'left'
              }}
            >
              ⚠️ 消息已取消（保留已接收内容）
            </div>
          )}
          {/* 显示图片 */}
          {(hasImages(message.content) ||
            (message.images && message.images.length > 0)) && (
            <div
              style={{
                marginTop: 8,
                display: 'flex',
                gap: 8,
                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              {/* 从 images 字段中的图片 */}
              {message.images?.map((imageUrl, index) => (
                <img
                  key={`images-${index}`}
                  src={imageUrl}
                  alt={`Image ${index + 1}`}
                  className="w-20 h-20 object-cover rounded"
                />
              ))}
            </div>
          )}

          {/* 显示用户选择的文本上下文 */}
          {message.texts && message.texts.length > 0 && (
            <div
              style={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: message.role === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: '#999',
                  marginBottom: 4,
                  fontWeight: 500
                }}
              >
                📄 上下文信息
              </div>
              {message.texts.map((textContent: string, index: number) => (
                <div
                  key={index}
                  style={{
                    background: message.role === 'user' ? '#e6f7ff' : '#f6ffed',
                    border: `1px solid ${message.role === 'user' ? '#91d5ff' : '#b7eb8f'}`,
                    borderRadius: 6,
                    padding: '6px 10px',
                    marginBottom: 4,
                    fontSize: 12,
                    color: '#555',
                    maxWidth: 280,
                    wordBreak: 'break-word',
                    lineHeight: 1.4
                  }}
                >
                  {textContent.length > 80
                    ? textContent.slice(0, 80) + '...'
                    : textContent}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {/* 操作区 */}
      <div className={`mt-2 flex gap-1 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
        {(message.role === 'user' ? userActionItems : aiActionItems).map((item) => (
          <Tooltip key={item.key}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={item.onItemClick}
                className="h-8 w-8 p-0"
              >
                {item.icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{item.label}</TooltipContent>
          </Tooltip>
        ))}
      </div>
      {/* 分享弹窗 */}
      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>分享消息</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={extractTextContent(message.content)}
              readOnly
              rows={3}
              className="resize-none"
            />
            <Button
              onClick={() => {
                navigator.clipboard.writeText(extractTextContent(message.content));
                console.log('已复制到剪贴板');
                setShareOpen(false);
              }}
              className="w-full"
            >
              复制内容
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface ChatBodyProps {
  session: ChatSession | null;
  loading?: boolean;
  streaming?: boolean;
  streamContent?: string;
  onSendMessage: (request: SendMessageRequest) => void;
  onRetryMessage?: (messageId: string) => void;
}

const ChatBody: React.FC<ChatBodyProps> = ({
  session,
  loading,
  streaming,
  streamContent,
  onSendMessage,
  onRetryMessage
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [localSession, setLocalSession] = useState(session);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session, streaming, streamContent]);

  useEffect(() => {
    setLocalSession(session);
  }, [session]);
  console.log(session, 'session');
  // 编辑消息内容
  const handleEdit = (id: string, newContent: string) => {
    if (!localSession) return;
    const updated = {
      ...localSession,
      messages: localSession.messages.map((m) =>
        m.id === id ? { ...m, content: newContent } : m
      )
    };
    setLocalSession(updated);
    // 在这里启动发送接口
    onSendMessage({ content: newContent });
  };

  // Retry ，把之前的上下文附带重新发送
  const handleRetry = (messageId: string) => {
    if (!localSession) return;
    const idx = localSession.messages.findIndex((m) => m.id === messageId);
    if (idx === -1) return;

    // 向前查找最近的一条用户消息
    for (let i = idx - 1; i >= 0; i--) {
      if (localSession.messages[i].role === 'user') {
        const userMessage = localSession.messages[i];
        console.log('重试消息:', extractTextContent(userMessage.content));

        // 构建包含完整上下文的重试请求
        const retryRequest: SendMessageRequest = {
          content:
            typeof userMessage.content === 'string'
              ? userMessage.content
              : extractTextContent(userMessage.content),
          images: userMessage.images || [],
          texts: userMessage.texts || []
        };

        console.log('重试请求包含上下文:', {
          content: retryRequest.content,
          images: retryRequest.images?.length || 0,
          texts: retryRequest.texts?.length || 0
        });

        // 使用新的重试机制（包含上下文）
        if (onRetryMessage) {
          onRetryMessage(userMessage.id);
        } else {
          // 降级到重新发送（包含完整上下文）
          onSendMessage(retryRequest);
        }
        return;
      }
    }
  };

  if (!localSession || localSession.messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="font-semibold text-xl mb-2">
            开始新的对话
          </div>
          <div className="mt-2">可以随时提问...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-start p-6 w-full overflow-y-auto box-border">
      {localSession.messages.map((msg, index, arr) => {
        // 判断是否为最后一条assistant消息
        const isLastAssistantMessage =
          msg.role === 'assistant' &&
          (index === arr.length - 1 ||
            !arr.slice(index + 1).some((m) => m.role === 'assistant'));

        // 创建一个安全的消息对象，确保不传递任何意外的属性
        const safeMessage = {
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp,
          status: msg.status,
          isLastAssistantMessage,
          texts: msg.texts,
          images: msg.images
        };

        return (
          <MessageItem
            key={msg.id}
            message={safeMessage}
            onEdit={handleEdit}
            onRetry={handleRetry}
          />
        );
      })}
      {/* AI回复区域 - 使用 StreamingBubble 显示流式内容 */}
      {(loading || (streaming && streamContent)) && (
        <div className="mb-3">
          <StreamingBubble
            content={streamContent || ''}
            loading={Boolean(loading && !streamContent)}
            typing={Boolean(streaming)}
            avatar={{ icon: <User className="h-4 w-4" />, style: { background: 'var(--theme-secondary)' } }}
            onComplete={() => {
              console.log('流式显示完成');
            }}
          />
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatBody;
