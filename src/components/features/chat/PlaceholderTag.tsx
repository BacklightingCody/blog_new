'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Info, Hash, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlaceholderTagProps {
  label: string;
  value?: string;
  type?: 'doc' | 'img' | 'product' | 'language' | 'version' | 'gitCommitId' | 'fileMd5' | 'other';
  onClick?: () => void;
  onDetail?: () => void;
  onRemove?: () => void;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  removable?: boolean;
  showIcon?: boolean;
}

export function PlaceholderTag({ 
  label, 
  value,
  type = 'other',
  onClick, 
  onDetail, 
  onRemove,
  variant = 'outline',
  size = 'default',
  className,
  removable = false,
  showIcon = true
}: PlaceholderTagProps) {
  
  // 根据类型获取图标和颜色
  const getTypeConfig = (type: string) => {
    const configs = {
      doc: { 
        icon: '📄', 
        color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
        darkColor: 'dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800'
      },
      img: { 
        icon: '🖼️', 
        color: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
        darkColor: 'dark:bg-green-950 dark:text-green-300 dark:border-green-800'
      },
      product: { 
        icon: '📦', 
        color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
        darkColor: 'dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800'
      },
      version: { 
        icon: '🏷️', 
        color: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
        darkColor: 'dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800'
      },
      language: { 
        icon: '🌐', 
        color: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100',
        darkColor: 'dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800'
      },
      gitCommitId: { 
        icon: '🔧', 
        color: 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100',
        darkColor: 'dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800'
      },
      fileMd5: { 
        icon: '🔐', 
        color: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
        darkColor: 'dark:bg-red-950 dark:text-red-300 dark:border-red-800'
      },
      other: { 
        icon: '🏷️', 
        color: 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100',
        darkColor: 'dark:bg-slate-950 dark:text-slate-300 dark:border-slate-800'
      }
    };
    return configs[type as keyof typeof configs] || configs.other;
  };

  const typeConfig = getTypeConfig(type);

  // 尺寸配置
  const sizeConfig = {
    sm: 'text-xs px-2 py-1 h-6',
    default: 'text-sm px-3 py-1.5 h-7',
    lg: 'text-base px-4 py-2 h-9'
  };

  return (
    <div className={cn("inline-flex items-center gap-1 group", className)}>
      <Badge
        variant={variant}
        className={cn(
          "cursor-pointer transition-all duration-200 font-medium border",
          "hover:shadow-md hover:scale-105 active:scale-95",
          sizeConfig[size],
          variant === 'outline' && typeConfig.color,
          variant === 'outline' && typeConfig.darkColor,
          onClick && "hover:shadow-lg"
        )}
        onClick={onClick}
      >
        <div className="flex items-center gap-1.5">
          {/* 类型图标 */}
          {showIcon && (
            <span className="text-xs leading-none">
              {typeConfig.icon}
            </span>
          )}
          
          {/* 标签文本 */}
          <span className="truncate max-w-32">
            {label}
          </span>
          
          {/* 值预览 */}
          {value && (
            <>
              <span className="opacity-60">:</span>
              <span className="truncate max-w-20 opacity-80 text-xs">
                {value.length > 10 ? `${value.substring(0, 10)}...` : value}
              </span>
            </>
          )}
        </div>
      </Badge>
      
      {/* 详情按钮 */}
      {onDetail && (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-muted/80"
          onClick={onDetail}
          title="查看详情"
        >
          <Info className="w-3 h-3" />
        </Button>
      )}

      {/* 移除按钮 */}
      {removable && onRemove && (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-destructive/10 hover:text-destructive"
          onClick={onRemove}
          title="移除"
        >
          <X className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
}

// 占位符标签组组件
interface PlaceholderTagGroupProps {
  tags: Array<{
    id: string;
    label: string;
    value?: string;
    type?: PlaceholderTagProps['type'];
  }>;
  onTagClick?: (id: string) => void;
  onTagRemove?: (id: string) => void;
  className?: string;
  removable?: boolean;
  maxDisplay?: number;
}

export function PlaceholderTagGroup({
  tags,
  onTagClick,
  onTagRemove,
  className,
  removable = false,
  maxDisplay = 5
}: PlaceholderTagGroupProps) {
  const displayTags = tags.slice(0, maxDisplay);
  const remainingCount = tags.length - maxDisplay;

  if (tags.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {displayTags.map((tag) => (
        <PlaceholderTag
          key={tag.id}
          label={tag.label}
          value={tag.value}
          type={tag.type}
          onClick={() => onTagClick?.(tag.id)}
          onRemove={removable ? () => onTagRemove?.(tag.id) : undefined}
          removable={removable}
          size="sm"
        />
      ))}
      
      {remainingCount > 0 && (
        <Badge variant="outline" className="text-xs bg-muted/50 text-muted-foreground">
          +{remainingCount} 更多
        </Badge>
      )}
    </div>
  );
}