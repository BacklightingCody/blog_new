import React from 'react';
import { Badge } from '@/components/ui/badge';

interface CustomCardContentProps {
  title: string;
  description: string;
  date: string;
  tags?: string[];
}

export function CustomCardContent({
  title,
  description,
  date,
  tags = []
}: CustomCardContentProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
        {title}
      </h3>
      
      <p className="text-sm text-muted-foreground line-clamp-3">
        {description}
      </p>
      
      <div className="flex items-center justify-between">
        <time className="text-xs text-muted-foreground">
          {new Date(date).toLocaleDateString('zh-CN')}
        </time>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 2}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}