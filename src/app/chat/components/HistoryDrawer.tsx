import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { ChatSession } from '../types';

interface HistoryDrawerProps {
  open: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  onSessionSelect: (sessionId: string) => void;
  onSessionDelete: (sessionId: string) => void;
}

const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  open,
  onClose,
  sessions,
  onSessionSelect,
  onSessionDelete
}) => {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>历史会话</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-2">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
              onClick={() => onSessionSelect(session.id)}
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {session.name}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(session.updatedAt).toLocaleString()}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onSessionDelete(session.id);
                }}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {sessions.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              暂无历史会话
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default HistoryDrawer;
