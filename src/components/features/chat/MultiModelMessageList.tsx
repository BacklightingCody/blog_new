'use client';

import { AVAILABLE_MODELS } from '@/constants/chat';
import { ChatMessage } from '@/zustand/stores/chatStore';
import { Badge } from '@/components/ui/badge';

interface MultiModelMessageListProps {
  messagesByModel: Record<string, ChatMessage[]> | undefined;
  models: string[];
  streamingByModel?: Record<string, string>;
}

export function MultiModelMessageList({ messagesByModel = {}, models, streamingByModel = {} }: MultiModelMessageListProps) {
  const getModelName = (value: string) => AVAILABLE_MODELS.find((m) => m.value === value)?.name || value;

  if (!models || models.length === 0) {
    return <div className="text-sm text-muted-foreground">未选择对比模型，请先在上方选择模型</div>;
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
        {models.map((model) => (
          <div key={model} className="rounded-xl border bg-background">
            <div className="px-4 py-3 border-b flex items-center justify-between">
              <div className="text-sm font-medium">{getModelName(model)}</div>
              <Badge variant="secondary" className="text-xs">{model}</Badge>
            </div>
            <div className="p-4 space-y-3 max-h-[60vh] overflow-auto">
              {(messagesByModel[model] || []).map((msg) => (
                <div key={msg.id} className="text-sm whitespace-pre-wrap leading-relaxed">
                  {typeof msg.content === 'string' ? msg.content : ''}
                </div>
              ))}
              {streamingByModel[model] && (
                <div className="text-sm whitespace-pre-wrap leading-relaxed">
                  {streamingByModel[model]}
                  <span className="inline-block w-1 h-4 bg-primary animate-pulse ml-1 align-middle" />
                </div>
              )}
              {(messagesByModel[model] || []).length === 0 && (
                <div className="text-xs text-muted-foreground">暂无该模型的回复</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


