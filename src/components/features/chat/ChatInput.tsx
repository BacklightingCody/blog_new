'use client';

import { useState, useRef, useCallback } from 'react';
import { Send, Paperclip, Image, FileText, X, Smile, Mic, Square, Hash } from 'lucide-react';
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
import { AttachmentSection } from './Attachments';

interface ChatInputProps {
  onSendMessage: (request: SendMessageRequest) => Promise<void>;
  isLoading?: boolean;
  onCancelRequest?: () => void;
  disabled?: boolean;
}

export function ChatInput({
  onSendMessage,
  isLoading = false,
  onCancelRequest,
  disabled = false
}: ChatInputProps) {
  const [input, setInput] = useState('');
  const [attachedImages, setAttachedImages] = useState<string[]>([]);
  const [attachedTexts, setAttachedTexts] = useState<string[]>([]);
  const [placeholders, setPlaceholders] = useState<PlaceholderItem[]>([]);
  const [isComposing, setIsComposing] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const openImagePickerRef = useRef<() => void>(() => {});
  const openFilePickerRef = useRef<() => void>(() => {});

  // 处理发送消息
  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading || disabled) return;

    const request: SendMessageRequest = {
      content: input.trim(),
      images: attachedImages,
      texts: attachedTexts,
      placeholders
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

  // 附件添加（由解耦组件回调）
  const addImages = (imgs: string[]) => setAttachedImages((prev) => [...prev, ...imgs]);
  const addTexts = (txts: string[]) => setAttachedTexts((prev) => [...prev, ...txts]);

  // 移除附件
  const removeImage = (index: number) => {
    setAttachedImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeText = (index: number) => {
    setAttachedTexts(prev => prev.filter((_, i) => i !== index));
  };

  // 占位符管理（简单示例：添加/移除）
  const addPlaceholder = (p: PlaceholderItem) => {
    setPlaceholders(prev => [...prev, p]);
  }
  const removePlaceholder = (idx: number) => {
    setPlaceholders(prev => prev.filter((_, i) => i !== idx));
  }

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
      {/* 占位符标签（位于图片占位符上方） */}
      {placeholders.length > 0 && (
        <div className="px-6 py-3 border-b bg-muted/10">
          <div className="flex items-center gap-2 flex-wrap">
            {placeholders.map((ph, idx) => (
              <Badge key={`${ph.key}-${idx}`} variant="outline" className="text-xs flex items-center gap-2">
                <span>{`@{{${ph.key}}}`}</span>
                {ph.type && <span className="opacity-60">({ph.type})</span>}
                <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => removePlaceholder(idx)}>
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* 附件区域（解耦为通用组件） */}
      <AttachmentSection
        images={attachedImages}
        texts={attachedTexts}
        onImagesAdd={addImages}
        onTextsAdd={addTexts}
        onRemoveImage={removeImage}
        onRemoveText={removeText}
        disabled={disabled || isLoading}
      >{({ openImagePicker, openFilePicker }) => {
        openImagePickerRef.current = openImagePicker;
        openFilePickerRef.current = openFilePicker;
        return null;
      }}</AttachmentSection>

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
                <DropdownMenuItem onClick={() => openImagePickerRef.current?.()}>
                  <Image className="w-4 h-4 mr-3" />
                  上传图片
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openFilePickerRef.current?.()}>
                  <FileText className="w-4 h-4 mr-3" />
                  上传文件
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 占位符按钮（简单示例：添加 doc/img 两类） */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={disabled || isLoading}
                  className="w-9 h-9 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-200 rounded-xl"
                >
                  <Hash className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => addPlaceholder({ id: `ph-${Date.now()}`, key: 'doc', type: 'doc', label: '文档', value: '' })}>
                  添加占位符：doc
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addPlaceholder({ id: `ph-${Date.now()}`, key: 'img', type: 'img', label: '图片', value: '' })}>
                  添加占位符：img
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

      {/* 附件输入已内聚至 AttachmentSection */}
    </div>
  );
}