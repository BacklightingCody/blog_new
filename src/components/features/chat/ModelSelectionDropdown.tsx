'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AVAILABLE_MODELS } from '@/constants/chat';

interface ModelSelectionDropdownProps {
  models?: string[]; // 可选模型列表（value），默认从 AVAILABLE_MODELS
  value: string[];
  onChange: (models: string[]) => void;
  disabled?: boolean;
}

export function ModelSelectionDropdown({ models, value, onChange, disabled }: ModelSelectionDropdownProps) {
  const options = (models && models.length > 0 ? models : AVAILABLE_MODELS.map(m => m.value)).map((v) => {
    const mm = AVAILABLE_MODELS.find(m => m.value === v);
    return { value: v, label: mm?.name || v };
  });

  const toggle = (v: string) => {
    if (value.includes(v)) onChange(value.filter(x => x !== v));
    else onChange([...value, v]);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled} className="cursor-pointer">
          选择模型 ({value.length})
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2 w-56">
        <div className="space-y-2">
          {options.map(opt => (
            <label key={opt.value} className="flex items-center gap-2 text-sm">
              <Checkbox checked={value.includes(opt.value)} onCheckedChange={() => toggle(opt.value)} />
              <span>{opt.label}</span>
            </label>
          ))}
          {options.length === 0 && (
            <div className="text-xs text-muted-foreground px-1 py-2">暂无可用模型</div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


