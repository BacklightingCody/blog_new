// src/Chat/components/ShareModal.tsx

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Share2 } from 'lucide-react';
import { ChatSession } from '../types';

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  session: ChatSession | null;
}

const ShareModal: React.FC<ShareModalProps> = ({ open, onClose, session }) => {
  if (!session) return null;

  const shareUrl = `${window.location.origin}/chat/${session.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    console.log('Link copied to clipboard!');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>分享对话</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">与其他人分享此聊天会话：</p>
          <div className="flex gap-2">
            <Input value={shareUrl} readOnly className="flex-1" />
            <Button onClick={handleCopyLink} className="flex items-center gap-2">
              <Copy className="h-4 w-4" />
              复制链接
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
