'use client';

import { ThemeProvider } from 'next-themes';
import { useEffect } from 'react';
import { themes } from '@/zustand/stores/themeStore';

export function Providers({ children }: { children: React.ReactNode }) {
  // 在客户端初始化颜色主题
  useEffect(() => {
    const saved = localStorage.getItem('color-theme') || 'blue';
    // 先清除后添加，避免重复类
    document.documentElement.classList.remove(...themes.map(t => `theme-${t.id}`));
    document.documentElement.classList.add(`theme-${saved}`);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
} 