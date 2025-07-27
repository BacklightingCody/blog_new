import React from 'react';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { PlaceholderItem } from '../types';

interface PlaceholderTagProps {
  placeholder: PlaceholderItem;
  onRemove?: (id: string) => void;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
}

const PlaceholderTag: React.FC<PlaceholderTagProps> = ({
  placeholder,
  onRemove,
  style,
  className,
  onClick
}) => {
  const getTagVariant = (type: PlaceholderItem['type']) => {
    const variantMap: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      doc: 'default',
      img: 'secondary',
      product: 'destructive',
      language: 'outline',
      version: 'secondary',
      gitCommitId: 'default',
      fileMd5: 'outline',
      other: 'default'
    };
    return variantMap[type] || 'default';
  };

  return (
    <div className={`relative inline-flex items-center ${className || ''}`} style={style}>
      <Badge
        variant={getTagVariant(placeholder.type)}
        className="m-0.5 px-2 py-1 text-xs font-bold cursor-pointer select-none"
        onClick={onClick}
      >
        {placeholder.placeholder || placeholder.key}
        {onRemove && (
          <X
            className="ml-1 h-3 w-3 cursor-pointer hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(placeholder.id);
            }}
          />
        )}
      </Badge>
    </div>
  );
};

export default PlaceholderTag;
