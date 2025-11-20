'use client';

import { useState } from 'react';
import { X, Bot, Sliders, MessageSquare, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ModelConfig, SystemPrompt } from '@/zustand/stores/chatStore';
import { AVAILABLE_MODELS } from '@/constants/chat';
import { cn } from '@/lib/utils';

interface ChatSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  modelConfig: ModelConfig;
  onModelConfigChange: (config: Partial<ModelConfig>) => void;
  systemPrompts: SystemPrompt[];
  selectedPromptId: string;
  onPromptSelect: (promptId: string) => void;
  onPromptSave: (prompt: Omit<SystemPrompt, 'id'>) => void;
  onPromptUpdate: (promptId: string, updates: Partial<Omit<SystemPrompt, 'id'>>) => void;
  onPromptDelete: (promptId: string) => void;
}

export function ChatSettings({
  isOpen,
  onClose,
  modelConfig,
  onModelConfigChange,
  systemPrompts,
  selectedPromptId,
  onPromptSelect,
  onPromptSave,
  onPromptUpdate,
  onPromptDelete
}: ChatSettingsProps) {
  const [editingPrompt, setEditingPrompt] = useState<SystemPrompt | null>(null);
  const [newPrompt, setNewPrompt] = useState({ name: '', content: '', description: '' });

  if (!isOpen) return null;

  // 从配置驱动的模型列表
  const availableModels = AVAILABLE_MODELS.map(m => ({
    id: m.value,
    name: m.name,
    description: `${m.provider === 'google' ? 'Google' : m.provider} 多模态对话模型${m.supports.image ? '（支持图片）' : ''}`
  }));

  const handleSaveNewPrompt = () => {
    if (newPrompt.name.trim() && newPrompt.content.trim()) {
      onPromptSave({
        name: newPrompt.name.trim(),
        content: newPrompt.content.trim(),
        description: newPrompt.description.trim() || undefined
      });
      setNewPrompt({ name: '', content: '', description: '' });
    }
  };

  const handleUpdatePrompt = () => {
    if (editingPrompt) {
      onPromptUpdate(editingPrompt.id, {
        name: editingPrompt.name,
        content: editingPrompt.content,
        description: editingPrompt.description
      });
      setEditingPrompt(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-theme-primary/50 to-theme-accent/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sliders className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">聊天设置</h2>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-xl">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* 内容区域 */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] bg-theme-accent/20">
          <Tabs defaultValue="model" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="model" className="flex items-center gap-2 cursor-pointer">
                <Bot className="w-4 h-4" />
                模型配置
              </TabsTrigger>
              <TabsTrigger value="prompts" className="flex items-center gap-2 cursor-pointer">
                <MessageSquare className="w-4 h-4" />
                系统提示词
              </TabsTrigger>
            </TabsList>

            {/* 模型配置 */}
            <TabsContent value="model" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="w-5 h-5" />
                    模型选择
                  </CardTitle>
                  <CardDescription>选择要使用的AI模型</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableModels.map((model) => (
                      <div
                        key={model.id}
                        className={cn(
                          "p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md",
                          modelConfig.model === model.id
                            ? "border-primary shadow-sm"
                            : "border-border hover:border-border/80"
                        )}
                        onClick={() => onModelConfigChange({ model: model.id })}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-sm">{model.name}</h3>
                            <p className="text-xs text-muted-foreground mt-1">{model.description}</p>
                          </div>
                          {modelConfig.model === model.id && (
                            <Badge variant="default" className="text-xs">当前</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>参数调节</CardTitle>
                  <CardDescription>调整模型的生成参数</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Temperature */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">创造性 (Temperature)</Label>
                      <span className="text-sm text-muted-foreground">{modelConfig.temperature}</span>
                    </div>
                    <Slider
                      value={[modelConfig.temperature || 0.5]}
                      onValueChange={([value]) => onModelConfigChange({ temperature: value })}
                      max={2}
                      min={0}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>保守</span>
                      <span>创新</span>
                    </div>
                  </div>

                  {/* Max Tokens */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">最大输出长度</Label>
                    <Input
                      type="number"
                      value={modelConfig.maxTokens || 2000}
                      onChange={(e) => onModelConfigChange({ maxTokens: parseInt(e.target.value) })}
                      min={100}
                      max={8000}
                      className="w-full"
                    />
                  </div>

                  {/* Top P */}
                  {modelConfig.topP !== undefined && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">核心采样 (Top P)</Label>
                        <span className="text-sm text-muted-foreground">{modelConfig.topP}</span>
                      </div>
                      <Slider
                        value={[modelConfig.topP]}
                        onValueChange={([value]) => onModelConfigChange({ topP: value })}
                        max={1}
                        min={0}
                        step={0.05}
                        className="w-full"
                      />
                    </div>
                  )}

                  {/* Top K */}
                  {modelConfig.topK !== undefined && (
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">候选词数量 (Top K)</Label>
                      <Input
                        type="number"
                        value={modelConfig.topK}
                        onChange={(e) => onModelConfigChange({ topK: parseInt(e.target.value) })}
                        min={1}
                        max={100}
                        className="w-full"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* 系统提示词 */}
            <TabsContent value="prompts" className="space-y-6">
              {/* 当前提示词 */}
              <Card>
                <CardHeader>
                  <CardTitle>当前提示词</CardTitle>
                  <CardDescription>选择或编辑系统提示词</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 改为“使用+重置”按钮而非下拉 Select */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="cursor-pointer"
                      onClick={() => {
                        // 选用第一条或提示用户从下方列表选择并应用
                        if (systemPrompts.length > 0) onPromptSelect(systemPrompts[0].id);
                      }}
                    >
                      使用当前所选
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer"
                      onClick={() => onPromptSelect('')}
                    >
                      重置（不使用）
                    </Button>
                  </div>

                  {/* 提示词列表 */}
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {systemPrompts.map((prompt) => (
                      <div
                        key={prompt.id}
                        className={cn(
                          "p-4 rounded-xl border transition-all duration-200",
                          selectedPromptId === prompt.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-border/80"
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium text-sm">{prompt.name}</h4>
                             {selectedPromptId === prompt.id && (
                               <Badge variant="secondary" className="text-xs">已使用</Badge>
                             )}
                            </div>
                            {prompt.description && (
                              <p className="text-xs text-muted-foreground mb-2">{prompt.description}</p>
                            )}
                             <p className="text-xs text-muted-foreground line-clamp-2">{prompt.content}</p>
                          </div>
                          <div className="flex items-center gap-1 ml-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingPrompt(prompt)}
                              className="h-8 w-8 p-0"
                            >
                              <Sliders className="w-3 h-3" />
                            </Button>
                             <Button
                               variant="outline"
                               size="sm"
                               onClick={() => onPromptSelect(prompt.id)}
                               className="h-8 px-2 text-xs"
                             >
                               使用
                             </Button>
                            {!prompt.isDefault && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onPromptDelete(prompt.id)}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 新建提示词 */}
              <Card>
                <CardHeader>
                  <CardTitle>新建提示词</CardTitle>
                  <CardDescription>创建自定义系统提示词</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>名称</Label>
                      <Input
                        value={newPrompt.name}
                        onChange={(e) => setNewPrompt(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="提示词名称"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>描述 (可选)</Label>
                      <Input
                        value={newPrompt.description}
                        onChange={(e) => setNewPrompt(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="简短描述"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>内容</Label>
                    <Textarea
                      value={newPrompt.content}
                      onChange={(e) => setNewPrompt(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="输入系统提示词内容..."
                      rows={4}
                    />
                  </div>
                  <Button onClick={handleSaveNewPrompt} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    保存提示词
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* 编辑提示词弹窗 */}
        {editingPrompt && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <CardTitle>编辑提示词</CardTitle>
                <CardDescription>修改 "{editingPrompt.name}" 的内容</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>名称</Label>
                  <Input
                    value={editingPrompt.name}
                    onChange={(e) => setEditingPrompt(prev => prev ? { ...prev, name: e.target.value } : null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>描述</Label>
                  <Input
                    value={editingPrompt.description || ''}
                    onChange={(e) => setEditingPrompt(prev => prev ? { ...prev, description: e.target.value } : null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>内容</Label>
                  <Textarea
                    value={editingPrompt.content}
                    onChange={(e) => setEditingPrompt(prev => prev ? { ...prev, content: e.target.value } : null)}
                    rows={6}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleUpdatePrompt} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    保存修改
                  </Button>
                  <Button variant="outline" onClick={() => setEditingPrompt(null)} className="flex-1">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    取消
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}