/**
 * 文档导航下拉菜单组件
 * 用于网站导航栏中的docs下拉菜单
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, FileText, Folder, TrendingUp } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockCategories, mockPopularArticles } from '@/mock/docs';
import { categoryColorMap, categoryIconMap } from '@/constants/index';
import Link from 'next/link';

interface DocsNavDropdownProps {
  className?: string;
}

export function DocsNavDropdown({ className }: DocsNavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState(mockCategories);
  const [popularArticles, setPopularArticles] = useState(mockPopularArticles.slice(0, 3));

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={`gap-2 ${className}`}
        >
          <FileText className="h-4 w-4" />
          文稿
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-80 p-0" 
        align="start"
        sideOffset={8}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* 全部文章 */}
              <div className="p-4 border-b">
                <Link href="/docs" className="block">
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
                    <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10">
                      <Folder className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">全部文章</div>
                      <div className="text-xs text-muted-foreground">浏览所有文档和文章</div>
                    </div>
                  </div>
                </Link>
              </div>

              {/* 分类列表 */}
              <div className="p-4 border-b">
                <DropdownMenuLabel className="px-0 pb-2 text-xs font-medium text-muted-foreground">
                  分类浏览
                </DropdownMenuLabel>
                <div className="space-y-1">
                  {categories.map((category) => {
                    const categoryColor = categoryColorMap[category.id as keyof typeof categoryColorMap] || '#3b82f6';
                    const categoryIcon = categoryIconMap[category.id as keyof typeof categoryIconMap] || '📁';
                    
                    return (
                      <Link key={category.id} href={`/docs/${category.id}`}>
                        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors group">
                          <div 
                            className="flex items-center justify-center w-8 h-8 rounded-md text-sm"
                            style={{ 
                              backgroundColor: `${categoryColor}20`,
                              color: categoryColor
                            }}
                          >
                            {categoryIcon}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium group-hover:text-primary transition-colors">
                              {category.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {category.description}
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {category.count}
                          </Badge>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* 热门文章 */}
              <div className="p-4">
                <DropdownMenuLabel className="px-0 pb-2 text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  热门文章
                </DropdownMenuLabel>
                <div className="space-y-2">
                  {popularArticles.map((article, index) => (
                    <Link key={article.id} href={`/docs/${article.category}/${article.slug}`}>
                      <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted transition-colors group">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium mt-0.5">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                            {article.title}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <span>{article.viewCount} 阅读</span>
                            <span>•</span>
                            <span>{article.likes} 点赞</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}