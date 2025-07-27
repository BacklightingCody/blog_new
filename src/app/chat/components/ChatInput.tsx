'use client'
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Image,
  Menu,
  Settings,
  Hash,
  Send,
  Square
} from 'lucide-react';
import { Attachments, Attachment } from './Attachments';
import { SendMessageRequest, ModelConfig, PlaceholderItem } from '../types';
import { DEFAULT_MODEL_PARAMS, MODELS } from '../constants';
import { mockPlaceholderData } from '../mock';
import PlaceholderTag from './PlaceholderTag';

interface ChatInputProps {
  onSend: (request: SendMessageRequest) => void;
  onCancel?: () => void;
  loading?: boolean;
  currentModel: string;
  modelConfig: ModelConfig;
  onModelConfigChange: (config: Partial<ModelConfig>) => void;
  getAvailableModels: (hasImage?: boolean) => any;
}

interface imageContextOptions {
  type: 'image_url';
  url: string;
  name: string;
}

interface textContextOptions {
  type: 'text';
  id: string;
  content: string;
}

const DEFAULT_IMAGE_CONTEXTS: imageContextOptions[] = [
  { type: 'image_url', url: 'https://picsum.photos/300/300', name: '图片1' },
  { type: 'image_url', url: 'https://picsum.photos/200/300', name: '图片2' }
];
const DEFAULT_TEXT_CONTEXTS: textContextOptions[] = [
  {
    type: 'text',
    id: 't2',
    content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。'
  },
  {
    type: 'text',
    id: 't1',
    content: '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。'
  }
];

const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  onCancel,
  loading,
  currentModel,
  modelConfig,
  onModelConfigChange,
  getAvailableModels
}) => {
  const [userInput, setUserInput] = useState<string>('');
  // 所有可选图片上下文
  const [imageContextOptions, setImageContextOptions] = useState<
    imageContextOptions[]
  >([...DEFAULT_IMAGE_CONTEXTS]);
  // 所有可选文字上下文
  const [textContextOptions, setTextContextsOptions] = useState<
    textContextOptions[]
  >([...DEFAULT_TEXT_CONTEXTS]);
  const [newTextContent, setNewTextContent] = useState('');
  const [textIdCounter, setTextIdCounter] = useState(3); // 从3开始，因为默认有t1和t2
  // 当前已选图片上下文
  const [imageContexts, setImageContexts] = useState<imageContextOptions[]>([]);
  // 当前已选文字上下文
  const [textContexts, setTextContexts] = useState<textContextOptions[]>([]);
  const [contextModalOpen, setContextModalOpen] = useState(false);
  const [selectedImageKeys, setSelectedImageKeys] = useState<string[]>([]);
  const [selectedTextKeys, setSelectedTextKeys] = useState<string[]>([]);
  const [modelParams, setModelParams] = useState({ ...DEFAULT_MODEL_PARAMS });
  const [modelModalOpen, setModelModalOpen] = useState(false);
  // const [placeholders, setPlaceholders] = useState<PlaceholderItem[]>([]); // 新增占位符状态
  const [placeholderModalOpen, setPlaceholderModalOpen] = useState(false); // 占位符弹窗
  const [selectedPlaceholderIds, setSelectedPlaceholderIds] = useState<string[]>([]);
  const [currentModelSupportsImage, setCurrentModelSupportsImage] = useState(false);

  // 监听 currentModel 变化，同步更新 form 和 modelParams
  useEffect(() => {
    const updatedParams = { ...modelParams, model: currentModel };
    const modelSupportsImage = MODELS.find(
      (m) => m.value === currentModel
    )?.supportsImage;
    setCurrentModelSupportsImage(!!modelSupportsImage);
    setModelParams(updatedParams);
    console.log(currentModel, currentModelSupportsImage, 'currentModel');
  }, [currentModel]);

  // 图片上传后直接加入 options 并自动选中
  const handleImageUpload = (info: any) => {
    const file = info.fileList[info.fileList.length - 1]?.originFileObj;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const newImg: imageContextOptions = {
          type: 'image_url',
          url: base64,
          name: file.name
        };
        // 去重：只保留不重复的图片
        setImageContextOptions((prev) => {
          const updatedList = prev.filter((img) => img.url !== newImg.url);
          return [...updatedList, newImg];
        });

        setImageContexts((prev) => {
          // 去重：只保留不重复的图片
          const updatedList = prev.filter((img) => img.url !== newImg.url);
          return [...updatedList, newImg];
        });
        // 自动切换到支持图片的模型
        const availableModels = getAvailableModels(true);
        // console.log(availableModels, 'model');
        if (!availableModels.find((m: any) => m.value === currentModel)) {
          onModelConfigChange({ model: availableModels[0]?.value || currentModel });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 打开上下文选择弹窗
  const handleContextSelection = () => {
    setContextModalOpen(true);
    setSelectedImageKeys(imageContexts.map((img) => img.url));
    setSelectedTextKeys(textContexts.map((txt) => txt.id));
  };

  // 添加新的文字上下文
  const handleAddTextContext = () => {
    if (newTextContent.trim()) {
      const newTextContext: textContextOptions = {
        type: 'text',
        id: `t${textIdCounter}`,
        content: newTextContent.trim()
      };

      // 添加到可选项中
      setTextContextsOptions((prev) => [...prev, newTextContext]);

      // 自动选中新添加的文字上下文
      setSelectedTextKeys((prev) => [...prev, newTextContext.id]);

      // 递增ID计数器
      setTextIdCounter((prev) => prev + 1);

      // 清空输入框
      setNewTextContent('');
    }
  };

  // 确认选择上下文
  const handleContextModalOk = () => {
    setImageContexts(
      imageContextOptions.filter((img) => selectedImageKeys.includes(img.url))
    );
    setTextContexts(
      textContextOptions.filter((txt) => selectedTextKeys.includes(txt.id))
    );
    // 新增：如果有图片被选中，自动切换为支持图片的模型
    const hasImages = selectedImageKeys.length > 0;
    // 保证当前模型在可选项内，否则自动切换
    const availableModels = getAvailableModels(hasImages);
    if (!availableModels.find((m: any) => m.value === currentModel)) {
      onModelConfigChange({ model: availableModels[0]?.value || currentModel });
    }
    setContextModalOpen(false);
    // 清空新文字输入框
    setNewTextContent('');
  };

  // 取消选择
  const handleContextModalCancel = () => {
    setContextModalOpen(false);
    // 清空新文字输入框
    setNewTextContent('');
    console.log(attachments);
  };

  // 移除已选图片上下文
  const removeImageContext = (item: Attachment) => {
    setImageContexts((prev) => {
      const next = prev.filter((img) => img.url !== item.url);
      // 如果没有图片了，可以切换回普通模型
      if (next.length === 0) {
        const availableModels = getAvailableModels(false);
        if (availableModels.find((m: any) => m.value === currentModel)) {
          // 当前模型支持纯文本，保持不变
        } else {
          // 切换到支持纯文本的模型
          onModelConfigChange({ model: availableModels[0]?.value || currentModel });
        }
      }
      return next;
    });
  };
  // 移除已选文字上下文
  const removeTextContext = (item: Attachment) => {
    setTextContexts((prev) => prev.filter((txt) => txt.id !== item.uid));
  };

  // 组装 Attachments 数据
  const attachments: Attachment[] = [
    ...imageContexts.map((img) => ({
      type: 'image_url' as const,
      url: img.url,
      name: img.name || '图片',
      uid: img.url
    })),
    ...textContexts.map((txt) => ({
      type: 'text' as const,
      content: txt.content,
      name: txt.content.slice(0, 15) + (txt.content.length > 15 ? '...' : ''),
      uid: txt.id
    }))
  ];

  const handleRemove = (item: Attachment) => {
    if (item.type === 'image_url') {
      removeImageContext(item);
    } else if (item.type === 'text') {
      removeTextContext(item);
    }
  };
  // 检查是否可以发送消息
  const canSendMessage = () => {
    return userInput.trim() || imageContexts.length > 0 || textContexts.length > 0;
  };

  // 发送消息
  const handleSend = (value: string) => {
    // 只要有文本内容、图片上下文或文本上下文中的任意一种，就可以发送
    if (canSendMessage()) {
      // 发送时附带当前上下文和模型参数
      onSend({
        content: value || '', // 即使没有文本内容也发送空字符串
        images: imageContexts.map((img) => img.url),
        texts: textContexts.map((text) => text.content),
        modelConfig: { ...modelParams, model: currentModel }
      });
      setUserInput('');
      setImageContexts([]);
      setTextContexts([]);
    }
  };

  // Sender组件的onSubmit处理（用于键盘提交）
  const handleSenderSubmit = (value: string) => {
    // 使用相同的逻辑处理键盘提交
    handleSend(value);
  };

  // 自定义发送按钮点击事件
  const handleCustomSend = () => {
    handleSend(userInput);
  };

  const handleWrite = (val: string) => {
    // setCanSend(false);
    setUserInput(val);
    if (!val.trim()) {
      // setCanSend(true);
      return;
    }
  };

  const handleModelSetting = () => {
    setModelModalOpen(true);
  };

  const handleModelModalOk = () => {
    setModelModalOpen(false);
  };

  const handleModelModalCancel = () => {
    setModelModalOpen(false);
  };

  // 处理占位符选择
  const handlePlaceholderSelection = () => {
    setPlaceholderModalOpen(true);
    setSelectedPlaceholderIds([]); // 每次打开都清空选择
  };

  // 确认选择占位符 - 直接插入到文本中
  const handlePlaceholderModalOk = () => {
    const selectedPlaceholders = mockPlaceholderData.filter((p: any) =>
      selectedPlaceholderIds.includes(p.id)
    );

    // 将选中的占位符插入到当前光标位置
    selectedPlaceholders.forEach((placeholder) => {
      insertPlaceholderToMessage(placeholder);
    });

    setPlaceholderModalOpen(false);
    setSelectedPlaceholderIds([]); // 插入后清空选择
  };

  // 插入占位符到消息中
  const insertPlaceholderToMessage = (placeholder: PlaceholderItem) => {
    const textarea = document.querySelector(
      '.chat-input-area textarea'
    ) as HTMLTextAreaElement;
    const cursorPosition = textarea?.selectionStart || userInput.length;
    const beforeCursor = userInput.slice(0, cursorPosition);
    const afterCursor = userInput.slice(cursorPosition);
    const placeholderText = `@${placeholder.placeholder}@`;
    const newMessage = beforeCursor + placeholderText + afterCursor;
    setUserInput(newMessage);

    // 设置光标位置到插入文本之后
    setTimeout(() => {
      if (textarea) {
        const newCursorPosition = cursorPosition + placeholderText.length;
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
        textarea.focus();
      }
    }, 0);
  };

  return (
    <TooltipProvider>
      <div className="p-3">
        {/* 附件区（图片/文本上下文） */}
        {(imageContexts.length > 0 || textContexts.length > 0) && (
          <div className="mb-2">
            <Attachments
              items={attachments}
              onRemove={handleRemove}
              placeholder={{}}
            />
          </div>
        )}

        {/* 输入区域 */}
        <div className="space-y-3">
          {/* 主输入框 */}
          <div className="relative">
            <Textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleCustomSend();
                }
              }}
              placeholder="请输入你的问题..."
              disabled={loading}
              className="min-h-[50px] max-h-[100px] resize-none pr-12 border-theme-accent"
            />

            {/* 发送按钮 */}
            <div className="absolute bottom-3 right-3">
              {loading ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onCancel}
                      className="h-8 w-8 p-0"
                    >
                      <Square className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>停止生成</TooltipContent>
                </Tooltip>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      disabled={!canSendMessage()}
                      onClick={handleCustomSend}
                      className="h-8 w-8 p-0 bg-theme-primary text-text"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>发送消息 (Enter)</TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>

          {/* 工具栏 - 水平排列 */}
          <div className="flex items-center gap-2 px-2">
            {/* 图片上传 */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={!currentModelSupportsImage}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        handleImageUpload({ file } as any);
                      }
                    };
                    input.click();
                  }}
                  className="h-8 w-8 p-0"
                >
                  <Image className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {currentModelSupportsImage ? '上传图片' : '该模型不支持上传图片，请更换模型'}
              </TooltipContent>
            </Tooltip>

            {/* 选择上下文 */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleContextSelection}
                  className="h-8 w-8 p-0"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>选择上下文</TooltipContent>
            </Tooltip>

            {/* 选择占位符 */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePlaceholderSelection}
                  className="h-8 w-8 p-0"
                >
                  <Hash className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>选择占位符</TooltipContent>
            </Tooltip>

            {/* 配置模型参数 */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleModelSetting}
                  className="h-8 w-8 p-0"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>配置模型参数</TooltipContent>
            </Tooltip>

            {/* 分隔符和模型信息 */}
            <div className="flex-1" />
            <div className="text-xs text-muted-foreground">
              {currentModel}
            </div>
          </div>
        </div>
      </div>

      {/* 上下文选择弹窗 */}
      <Dialog open={contextModalOpen} onOpenChange={setContextModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>选择上下文</DialogTitle>
          </DialogHeader>
          <div className="mb-4">
            <div className="font-medium mb-2">图片上下文</div>
            <div className="space-y-2">
              {imageContextOptions.map((img) => (
                <div key={img.url} className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedImageKeys.includes(img.url)}
                    onCheckedChange={(checked: boolean) => {
                      if (checked) {
                        setSelectedImageKeys([...selectedImageKeys, img.url]);
                      } else {
                        setSelectedImageKeys(selectedImageKeys.filter(k => k !== img.url));
                      }
                    }}
                  />
                  <img
                    src={img.url}
                    alt={img.name}
                    className="w-9 h-9 rounded object-cover"
                  />
                  <span className="text-sm">{img.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <div className="font-medium mb-2">文字上下文</div>
            <div className="space-y-2">
              {textContextOptions.map((txt) => (
                <div key={txt.id} className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedTextKeys.includes(txt.id)}
                    onCheckedChange={(checked: boolean) => {
                      if (checked) {
                        setSelectedTextKeys([...selectedTextKeys, txt.id]);
                      } else {
                        setSelectedTextKeys(selectedTextKeys.filter(k => k !== txt.id));
                      }
                    }}
                  />
                  <span className="text-sm">
                    {txt.content.length > 50
                      ? txt.content.slice(0, 50) + '...'
                      : txt.content}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="font-medium mb-2">添加新的文字上下文</div>
            <div className="flex gap-2">
              <Textarea
                value={newTextContent}
                onChange={(e) => setNewTextContent(e.target.value)}
                placeholder="请输入文字上下文内容..."
                className="flex-1"
                rows={3}
              />
              <Button
                onClick={handleAddTextContext}
                disabled={!newTextContent.trim()}
                className="self-start"
              >
                添加
              </Button>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={handleContextModalCancel}>
              取消
            </Button>
            <Button onClick={handleContextModalOk}>
              确定
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* 设置模型参数弹窗 */}
      <Dialog open={modelModalOpen} onOpenChange={setModelModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>配置模型参数</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="model">模型</Label>
              <Select
                value={currentModel}
                onValueChange={(value) => {
                  onModelConfigChange({ model: value });
                  setModelParams({ ...modelParams, model: value });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择模型" />
                </SelectTrigger>
                <SelectContent>
                  {(imageContexts.length > 0
                    ? getAvailableModels(true)
                    : getAvailableModels()
                  ).map((model: any) => (
                    <SelectItem key={model.value} value={model.value}>
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="temperature">Temperature</Label>
              <Input
                id="temperature"
                type="number"
                min="0"
                max="2"
                step="0.01"
                value={modelParams.temperature}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  setModelParams({ ...modelParams, temperature: value });
                  onModelConfigChange({ temperature: value });
                }}
              />
            </div>

            <div>
              <Label htmlFor="topK">TopK</Label>
              <Input
                id="topK"
                type="number"
                min="1"
                max="100"
                step="1"
                value={modelParams.topK}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setModelParams({ ...modelParams, topK: value });
                  onModelConfigChange({ topK: value });
                }}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={handleModelModalCancel}>
              取消
            </Button>
            <Button onClick={handleModelModalOk}>
              确定
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* 占位符选择弹窗 */}
      <Dialog open={placeholderModalOpen} onOpenChange={setPlaceholderModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>选择占位符</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {mockPlaceholderData.map((placeholder: any) => (
              <div key={placeholder.id} className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedPlaceholderIds.includes(placeholder.id)}
                  onCheckedChange={(checked: boolean) => {
                    if (checked) {
                      setSelectedPlaceholderIds([...selectedPlaceholderIds, placeholder.id]);
                    } else {
                      setSelectedPlaceholderIds(selectedPlaceholderIds.filter(id => id !== placeholder.id));
                    }
                  }}
                />
                <div className="flex-1">
                  <PlaceholderTag placeholder={placeholder} />
                  <span className="ml-2 text-sm text-muted-foreground">
                    {placeholder.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setPlaceholderModalOpen(false)}>
              取消
            </Button>
            <Button onClick={handlePlaceholderModalOk}>
              确定
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default ChatInput;
