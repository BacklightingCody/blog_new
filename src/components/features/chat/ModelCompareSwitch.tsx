'use client';

import { Switch } from '@/components/ui/switch';
import { ModelSelectionDropdown } from './ModelSelectionDropdown';

interface ModelCompareSwitchProps {
  enabled: boolean;
  selectedModels: string[];
  onToggle: (enabled: boolean) => void;
  onSelectModels: (models: string[]) => void;
}

export function ModelCompareSwitch({ enabled, selectedModels, onToggle, onSelectModels }: ModelCompareSwitchProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm">对比模式</span>
      <Switch checked={enabled} onCheckedChange={onToggle} />
      {enabled && (
        <ModelSelectionDropdown value={selectedModels} onChange={onSelectModels} />
      )}
    </div>
  );
}


