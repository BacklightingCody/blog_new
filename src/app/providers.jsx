'use client';

import { ThemeProvider } from 'next-themes';
import { useEffect } from 'react';

export function Providers({ children }) {
  // 在客户端初始化颜色主题
  useEffect(() => {
    const savedColorTheme = localStorage.getItem('color-theme') || 'blue';
    document.documentElement.classList.add(`theme-${savedColorTheme}`);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
} 