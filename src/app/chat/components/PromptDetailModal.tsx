// src/Chat/components/PromptDetailModal.tsx

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Edit3 } from 'lucide-react';
import { SystemPrompt } from '../types';

interface PromptDetailModalProps {
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  prompt: SystemPrompt;
}

const PromptDetailModal: React.FC<PromptDetailModalProps> = ({
  open,
  onClose,
  onEdit,
  prompt
}) => {
  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>提示词名称: {prompt.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="text-md font-semibold mb-2">提示词内容:</h4>
              <div className="p-3 bg-gray-50 rounded-lg border text-sm whitespace-pre-wrap">
                {prompt.content}
              </div>
            </div>
            {prompt.isDefault && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>注意:</strong> 这是默认的提示词
                </p>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onClose}>
              关闭
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onEdit}
                  disabled={prompt.isDefault}
                  className="flex items-center gap-2"
                >
                  <Edit3 className="h-4 w-4" />
                  编辑
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {prompt.isDefault ? '默认提示词不可编辑' : '编辑此提示词'}
              </TooltipContent>
            </Tooltip>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default PromptDetailModal;
