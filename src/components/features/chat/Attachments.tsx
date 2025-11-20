'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Image as ImageIcon, X } from 'lucide-react';
import { AVAILABLE_MODELS, DEFAULT_MODEL, getModelByValue } from '@/constants/chat';

export interface AttachmentLimits {
  maxFileSize: number;
  allowedImageTypes: string[];
  allowedFileTypes: string[];
}

interface AttachmentSectionProps {
  images: string[];
  texts: string[];
  onImagesAdd: (images: string[]) => void;
  onTextsAdd: (texts: string[]) => void;
  onRemoveImage: (index: number) => void;
  onRemoveText: (index: number) => void;
  disabled?: boolean;
  limits?: AttachmentLimits;
  children?: (controls: { openImagePicker: () => void; openFilePicker: () => void }) => React.ReactNode;
}

export function AttachmentSection({
  images,
  texts,
  onImagesAdd,
  onTextsAdd,
  onRemoveImage,
  onRemoveText,
  disabled = false,
  limits,
  children,
}: AttachmentSectionProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaults = getModelByValue(DEFAULT_MODEL)?.limits;
  const cfg: AttachmentLimits = {
    maxFileSize: limits?.maxFileSize ?? defaults?.maxFileSize ?? 5 * 1024 * 1024,
    allowedImageTypes: limits?.allowedImageTypes ?? defaults?.allowedImageTypes ?? ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedFileTypes: limits?.allowedFileTypes ?? defaults?.allowedFileTypes ?? ['.txt', '.md', '.json', '.csv', '.pdf'],
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((f) => cfg.allowedImageTypes.includes(f.type) && f.size <= cfg.maxFileSize);
    const readers: Promise<string>[] = validFiles.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as string) || '');
          reader.readAsDataURL(file);
        })
    );
    Promise.all(readers).then((results) => {
      if (results.length) onImagesAdd(results);
    });
    e.target.value = '';
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((f) => f.size <= cfg.maxFileSize);
    const readers: Promise<string>[] = validFiles.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as string) || '');
          reader.readAsText(file);
        })
    );
    Promise.all(readers).then((results) => {
      if (results.length) onTextsAdd(results);
    });
    e.target.value = '';
  };

  const openImagePicker = () => imageInputRef.current?.click();
  const openFilePicker = () => fileInputRef.current?.click();

  const hasAttachments = images.length > 0 || texts.length > 0;

  return (
    <div className="w-full">
      {/* 触发器插槽 */}
      {children?.({ openImagePicker, openFilePicker })}

      {/* 附件预览区域 */}
      {hasAttachments && (
        <div className="px-6 py-4 border-b bg-muted/20">
          <div className="space-y-3">
            {images.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">图片附件 ({images.length})</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="relative overflow-hidden rounded-xl border-2 border-border/50 shadow-sm hover:shadow-md transition-all duration-200">
                        <img src={image} alt={`附件 ${index + 1}`} className="w-20 h-20 object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onRemoveImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {texts.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">文本附件 ({texts.length})</span>
                </div>
                <div className="space-y-2">
                  {texts.map((text, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-background/80 rounded-xl border border-border/50 hover:border-border transition-colors duration-200">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">文本内容 ({text.length} 字符)</div>
                        <div className="text-xs text-muted-foreground truncate">{text.substring(0, 50)}...</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveText(index)}
                        className="w-8 h-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-200"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 隐藏输入 */}
      <input
        ref={imageInputRef}
        type="file"
        accept={cfg.allowedImageTypes.join(',')}
        multiple
        onChange={handleImageUpload}
        className="hidden"
        disabled={disabled}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept={cfg.allowedFileTypes.join(',')}
        multiple
        onChange={handleFileUpload}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
}


