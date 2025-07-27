'use client'
import React from 'react';

interface CustomBubbleProps {
  content: string;
  placement?: 'start' | 'end';
  avatar?: {
    icon: React.ReactElement;
    style: { background: string };
  };
  typing?: boolean;
  loading?: boolean;
  customStyle?: {
    borderColor?: string;
    backgroundColor?: string;
  };
}

const CustomBubble: React.FC<CustomBubbleProps> = ({
  content,
  placement = 'start',
  avatar,
  typing = false,
  loading = false,
  customStyle
}) => {
  const isUser = placement === 'end';

  return (
    <div className={`flex items-start mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {avatar && (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-lg mt-0 mx-2"
          style={{ background: avatar.style.background }}
        >
          {avatar.icon}
        </div>
      )}

      {/* Content Bubble - 使用 Tailwind CSS */}
      <div
        className={`
          ${isUser
            ? 'bg-theme-primary text-white rounded-2xl rounded-br-sm'
            : 'bg-theme-primary dark:bg-theme-primary text-text rounded-lg'
          }
          px-4 py-3 break-words whitespace-pre-wrap relative text-sm leading-normal
          max-w-full min-h-[46px] flex items-center
          ${customStyle?.borderColor
            ? 'border'
            : isUser
              ? 'border-none'
              : 'border border-gray-100 dark:border-gray-600'
          }
        `}
        style={{
          backgroundColor: customStyle?.backgroundColor,
          borderColor: customStyle?.borderColor
        }}
      >
        {/* Loading 状态 */}
        {loading && !content && (
          <div className="flex items-center gap-1">
            <span>正在思考中</span>
            <div className="flex gap-0.5">
              <div
                className={`w-1 h-1 rounded-full ${isUser ? 'bg-white' : 'bg-theme-primary'} animate-bounce`}
                style={{ animationDelay: '0s' }}
              />
              <div
                className={`w-1 h-1 rounded-full ${isUser ? 'bg-white' : 'bg-theme-primary'} animate-bounce`}
                style={{ animationDelay: '0.16s' }}
              />
              <div
                className={`w-1 h-1 rounded-full ${isUser ? 'bg-white' : 'bg-theme-primary'} animate-bounce`}
                style={{ animationDelay: '0.32s' }}
              />
            </div>
          </div>
        )}

        {/* 内容 */}
        {content && (
          <div className="flex-1">
            {content}
            {/* 打字光标 */}
            {typing && (
              <span
                className={`ml-0.5 animate-pulse font-normal ${
                  isUser ? 'text-white/80' : 'text-theme-primary'
                }`}
                style={{ animation: 'blink 1s infinite' }}
              >
                |
              </span>
            )}
          </div>
        )}
      </div>

      {/* 内联样式 - 避免外部依赖 */}
      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default CustomBubble;
