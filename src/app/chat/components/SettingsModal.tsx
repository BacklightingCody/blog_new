import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Trash2, Edit3, Plus } from 'lucide-react';
import { SystemPrompt } from '../types';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  systemPrompts: SystemPrompt[];
  selectedPromptId: string;
  editingPromptId?: string | null;
  onSelectPrompt: (id: string) => void;
  onSavePrompt: (values: { name: string; content: string }) => void;
  onUpdatePrompt: (id: string, values: { name: string; content: string }) => void;
  onDeletePrompt: (id: string) => void;
  onStartEdit: (id: string) => void;
  onCancelEdit: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  open,
  onClose,
  systemPrompts,
  selectedPromptId,
  editingPromptId,
  onSelectPrompt,
  onSavePrompt,
  onUpdatePrompt,
  onDeletePrompt,
  onStartEdit,
  onCancelEdit
}) => {
  const [formData, setFormData] = useState({ name: '', content: '' });

  const editingPrompt = systemPrompts.find((p) => p.id === editingPromptId);

  // 当编辑模式开启时，自动填充表单
  useEffect(() => {
    if (editingPromptId && editingPrompt) {
      setFormData({
        name: editingPrompt.name,
        content: editingPrompt.content
      });
    } else {
      setFormData({ name: '', content: '' });
    }
  }, [editingPromptId, editingPrompt]);

  const handleSave = () => {
    if (!formData.name.trim() || !formData.content.trim()) {
      console.warn('请填写完整的名称和内容');
      return;
    }

    if (editingPromptId) {
      // 更新提示
      onUpdatePrompt(editingPromptId, formData);
      console.log('系统提示更新成功！');
    } else {
      // 保存新提示
      onSavePrompt(formData);
      console.log('系统提示保存成功！');
    }
    setFormData({ name: '', content: '' });
    onCancelEdit();
  };

  const handleDelete = (id: string) => {
    const prompt = systemPrompts.find((p) => p.id === id);
    if (!prompt) return;
    if (prompt.isDefault) {
      console.warn('不能删除默认提示');
      return;
    }
    onDeletePrompt(id);
    console.log('系统提示已删除！');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>AI 设置</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">当前系统提示</h3>
            <Select value={selectedPromptId} onValueChange={onSelectPrompt}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="选择一个系统提示" />
              </SelectTrigger>
              <SelectContent>
                {systemPrompts.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} {p.isDefault && '(默认)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <h4 className="text-md font-semibold mb-3">
              {editingPromptId ? '编辑系统提示' : '添加新系统提示'}
            </h4>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">提示名称</Label>
                <Input
                  id="name"
                  placeholder="输入提示名称"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="content">提示内容</Label>
                <Textarea
                  id="content"
                  rows={4}
                  placeholder="输入你的系统提示..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                {editingPromptId && (
                  <Button variant="outline" onClick={onCancelEdit}>
                    取消
                  </Button>
                )}
                <Button onClick={handleSave}>
                  {editingPromptId ? '更新提示' : '保存提示'}
                </Button>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-md font-semibold mb-3">已保存的提示</h4>
            <div className="space-y-3">
              {systemPrompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="flex items-start justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{prompt.name}</span>
                      {prompt.isDefault && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          默认
                        </span>
                      )}
                      {prompt.id === selectedPromptId && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                          当前
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {prompt.content.length > 100
                        ? `${prompt.content.substring(0, 100)}...`
                        : prompt.content}
                    </div>
                  </div>
                  {!prompt.isDefault && (
                    <div className="flex gap-2 ml-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onStartEdit(prompt.id)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (window.confirm(`确定要删除 "${prompt.name}" 吗？`)) {
                            handleDelete(prompt.id);
                          }
                        }}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        disabled={prompt.id === selectedPromptId}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
