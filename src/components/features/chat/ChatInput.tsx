'use client';

import { useState, useRef, useCallback } from 'react';
import { Send, Paperclip, Image, FileText, X, Smile, Mic, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { PlaceholderItem, SendMessageRequest } from '@/zustand/stores/chatStore';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (request: SendMessageRequest) => Promise<void>;
  isLoading?: boolean;
  onCancelRequest?: () => void;
  placeholders?: PlaceholderItem[];
  disabled?: boolean;
}

export function ChatInput({
  onSendMessage,
  isLoading = false,
  onCancelRequest,
  placeholders = [],
  disabled = false
}: ChatInputProps) {
  const [input, setInput] = useState('');
  const [attachedImages, setAttachedImages] = useState<string[]>([]);
  const [attachedTexts, setAttachedTexts] = useState<string[]>([]);
  const [isComposing, setIsComposing] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // 处理发送消息
  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading || disabled) return;

    const request: SendMessageRequest = {
      content: input.trim(),
      images: attachedImages,
      texts: attachedTexts
    };

    // 清空输入
    setInput('');
    setAttachedImages([]);
    setAttachedTexts([]);

    // 发送消息
    await onSendMessage(request);
  }, [input, attachedImages, attachedTexts, isLoading, disabled, onSendMessage]);

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  // 处理图片上传
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      if (file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024) { // 10MB限制
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setAttachedImages(prev => [...prev, result]);
        };
        reader.readAsDataURL(file);
      }
    });
    e.target.value = '';
  };

  // 处理文件上传
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      if (file.size <= 5 * 1024 * 1024) { // 5MB限制
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setAttachedTexts(prev => [...prev, result]);
        };
        reader.readAsText(file);
      }
    });
    e.target.value = '';
  };

  // 移除附件
  const removeImage = (index: number) => {
    setAttachedImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeText = (index: number) => {
    setAttachedTexts(prev => prev.filter((_, i) => i !== index));
  };

  // 插入占位符
  const insertPlaceholder = (placeholder: PlaceholderItem) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const placeholderText = `@{{${placeholder.key}}}`;
    const newValue = input.slice(0, start) + placeholderText + input.slice(end);
    
    setInput(newValue);
    
    // 设置光标位置
    setTimeout(() => {
      const newPosition = start + placeholderText.length;
      textarea.setSelectionRange(newPosition, newPosition);
      textarea.focus();
    }, 0);
  };

  // 按类型分组占位符
  const groupedPlaceholders = placeholders.reduce((groups, item) => {
    if (!groups[item.type]) {
      groups[item.type] = [];
    }
    groups[item.type].push(item);
    return groups;
  }, {} as Record<string, PlaceholderItem[]>);

  const hasAttachments = attachedImages.length > 0 || attachedTexts.length > 0;
  const canSend = input.trim() && !isLoading && !disabled;

  return (
    <div className="border-t bg-background/95 backdrop-blur-sm">
      {/* 附件预览区域 */}
      {hasAttachments && (
        <div className="px-6 py-4 border-b bg-muted/20">
          <div className="space-y-3">
            {/* 图片附件 */}
            {attachedImages.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    图片附件 ({attachedImages.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {attachedImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="relative overflow-hidden rounded-xl border-2 border-border/50 shadow-sm hover:shadow-md transition-all duration-200">
                        <img
                          src={image}
                          alt={`附件 ${index + 1}`}
                          className="w-20 h-20 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 文本附件 */}
            {attachedTexts.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">
                    文本附件 ({attachedTexts.length})
                  </span>
                </div>
                <div className="space-y-2">
                  {attachedTexts.map((text, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-background/80 rounded-xl border border-border/50 hover:border-border transition-colors duration-200">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          文本内容 ({text.length} 字符)
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {text.substring(0, 50)}...
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeText(index)}
                        className="w-8 h-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-200"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 输入区域 */}
      <div className="p-6">
        <div className={cn(
          "relative rounded-2xl border-2 transition-all duration-300 backdrop-blur-sm",
          isFocused 
            ? "border-theme-primary/50 shadow-xl shadow-theme-primary/10" 
            : "border-border/50 hover:border-border shadow-lg",
          disabled && "opacity-50 cursor-not-allowed"
        )}>
          {/* 文本输入框 */}
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={
              isLoading 
                ? "AI正在思考中，请稍候..." 
                : "输入你的问题... (Enter发送，Shift+Enter换行)"
            }
            disabled={disabled}
            className="min-h-[80px] max-h-[240px] resize-none border-0 focus:ring-0 focus:ring-offset-0 pr-24 text-base leading-relaxed placeholder:text-muted-foreground/60"
          />

          {/* 右侧操作按钮组 */}
          <div className="absolute right-4 bottom-4 flex items-center gap-2">
            {/* 附件按钮 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={disabled || isLoading}
                  className="w-9 h-9 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-200 rounded-xl"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => imageInputRef.current?.click()}>
                  <Image className="w-4 h-4 mr-3" />
                  上传图片
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                  <FileText className="w-4 h-4 mr-3" />
                  上传文件
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 占位符按钮 */}
            {placeholders.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={disabled || isLoading}
                    className="w-9 h-9 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-200 rounded-xl"
                  >
                    <Smile className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72 max-h-80 overflow-y-auto">
                  {Object.entries(groupedPlaceholders).map(([type, items]) => (
                    <div key={type}>
                      <div className="px-3 py-2 text-xs font-semibold text-muted-foreground border-b bg-muted/30">
                        {type === 'doc' && '📄 文档'}
                        {type === 'img' && '🖼️ 图片'}
                        {type === 'product' && '📦 产品'}
                        {type === 'version' && '🏷️ 版本'}
                        {type === 'language' && '🌐 语言'}
                        {type === 'gitCommitId' && '🔧 Git'}
                        {type === 'fileMd5' && '🔐 文件'}
                      </div>
                      {items.map((item) => (
                        <DropdownMenuItem
                          key={item.id}
                          onClick={() => insertPlaceholder(item)}
                          className="flex flex-col items-start p-4 hover:bg-muted/50"
                        >
                          <div className="font-medium text-sm mb-1">{item.label}</div>
                          {item.description && (
                            <div className="text-xs text-muted-foreground mb-2">{item.description}</div>
                          )}
                          <Badge variant="outline" className="text-xs">
                            @{`{{${item.key}}}`}
                          </Badge>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* 发送/取消按钮 */}
            {isLoading ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancelRequest}
                className="w-9 h-9 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200 rounded-xl"
              >
                <Square className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSend}
                disabled={!canSend}
                size="sm"
                className={cn(
                  "w-9 h-9 p-0 transition-all duration-300 rounded-xl",
                  canSend 
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105" 
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                <Send className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* 底部提示信息 */}
        <div className="flex items-center justify-between mt-3 px-1">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Enter</kbd>
              发送
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Shift</kbd>
              <span>+</span>
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Enter</kbd>
              换行
            </span>
            {hasAttachments && (
              <Badge variant="secondary" className="text-xs">
                {attachedImages.length + attachedTexts.length} 个附件
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {input.length > 0 && (
              <span className={cn(
                "transition-colors duration-200",
                input.length > 2000 ? "text-destructive font-medium" : "text-muted-foreground"
              )}>
                {input.length.toLocaleString()}/2,000
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 隐藏的文件输入 */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        className="hidden"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.md,.json,.csv,.doc,.docx"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
}