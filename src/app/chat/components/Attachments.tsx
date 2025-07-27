'use client'
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, FileText, Image as ImageIcon } from 'lucide-react';

export interface Attachment {
  type: 'image_url' | 'text';
  url?: string;
  content?: string;
  name: string;
  uid: string;
}

interface AttachmentsProps {
  items: Attachment[];
  onRemove: (item: Attachment) => void;
  placeholder?: any;
}

export const Attachments: React.FC<AttachmentsProps> = ({ items, onRemove }) => {
  if (!items || items.length === 0) {
    return null;
  }

  // 分离图片和文字附件
  const imageItems = items.filter((item) => item.type === 'image_url');
  const textItems = items.filter((item) => item.type === 'text');

  return (
    <div className="flex flex-col gap-3">
      {/* 图片区域 */}
      {imageItems.length > 0 && (
        <div>
          <div className="text-xs text-gray-600 mb-2 font-medium">
            图片附件 ({imageItems.length})
          </div>
          <div className="flex flex-wrap gap-3">
            {imageItems.map((item) => (
              <Card
                key={item.uid}
                className="w-[140px] relative shadow-md rounded-lg overflow-hidden transition-all duration-200 border border-gray-200 hover:shadow-lg"
              >
                <CardContent className="p-2 bg-gray-50">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(item)}
                    className="absolute top-1.5 right-1.5 z-10 bg-black/60 text-white border-none rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-black/80 p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                  <div>
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-[90px] object-cover rounded-md cursor-pointer"
                      onClick={() => window.open(item.url, '_blank')}
                    />
                    <span
                      className="text-xs text-gray-600 block mt-1.5 text-center font-medium overflow-hidden text-ellipsis whitespace-nowrap leading-3"
                      title={item.name}
                    >
                      {item.name}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 文字区域 */}
      {textItems.length > 0 && (
        <div>
          <div className="text-xs text-gray-600 mb-2 font-medium">
            文字附件 ({textItems.length})
          </div>
          <div className="flex gap-2 flex-wrap">
            {textItems.map((item) => (
              <Card
                key={item.uid}
                className="w-[45%] relative shadow-md rounded-lg overflow-hidden transition-all duration-200 border border-blue-100 hover:shadow-lg"
              >
                <CardContent className="p-3 bg-gray-50">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(item)}
                    className="absolute top-1.5 right-1.5 z-10 bg-black/60 text-white border-none rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-black/80 p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                  <div className="min-h-[40px] flex items-center">
                    <div className="flex items-center w-full gap-2">
                      <FileText className="text-theme-primary text-xl flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span
                          className="text-sm text-gray-800 font-medium block overflow-hidden text-ellipsis whitespace-nowrap leading-[18px]"
                          title={item.name}
                        >
                          {item.name}
                        </span>
                        {item.content && (
                          <span
                            className="text-xs text-gray-500 block overflow-hidden text-ellipsis whitespace-nowrap mt-0.5 leading-[14px]"
                            title={item.content}
                          >
                            {item.content}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Attachments;
