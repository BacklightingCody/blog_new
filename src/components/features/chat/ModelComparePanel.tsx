'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AVAILABLE_MODELS } from '@/constants/chat';
import { useChatStore } from '@/zustand/stores/chatStore';

interface ModelComparePanelProps {
  defaultPrompt?: string;
}

export function ModelComparePanel({ defaultPrompt = '' }: ModelComparePanelProps) {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Record<string, string>>({});
  const models = useMemo(() => AVAILABLE_MODELS, []);
  const sendMessage = useChatStore((s) => s.sendMessage);

  const startComparison = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResults({});
    try {
      // 串行简版（避免创建多会话），可升级为并发+独立会话
      for (const m of models) {
        await sendMessage({ content: prompt, modelConfig: { model: m.value }, suppressUserMessage: true });
        // 这里为了最小入侵，直接读取最新 AI 回复可在 store 层增加返回值以获取
        // 简化：暂不读取历史结果，显示占位
        setResults((prev) => ({ ...prev, [m.value]: '已发送，结果见当前会话记录' }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>模型对比</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="输入用于对比的提示词..." />
        <Button onClick={startComparison} disabled={loading || !prompt.trim()} className="cursor-pointer">
          {loading ? '对比中...' : '开始对比'}
        </Button>
        <div className="grid gap-3 md:grid-cols-2">
          {models.map((m) => (
            <div key={m.value} className="p-3 border rounded-lg">
              <div className="text-sm font-medium mb-2">{m.name}</div>
              <div className="text-sm text-muted-foreground whitespace-pre-wrap min-h-[2rem]">
                {results[m.value] || '等待结果...'}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


