'use client';

import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useThemeStore, themes } from '@/zustand/stores/themeStore';

export const ThemeSelector = React.memo(function ThemeSelector() {
  const { colorTheme, setColorTheme } = useThemeStore();
  const initialized = useRef(false);

  // 初始化流程：优先 localStorage，其次现有 store，再默认 blue
  useEffect(() => {
    if (initialized.current) return;

    let next = colorTheme || 'blue';
    try {
      const saved = localStorage.getItem('color-theme');
      if (saved) next = saved;
    } catch {}

    // 应用并持久化
    setColorTheme(next);
    document.documentElement.classList.remove(...themes.map(t => `theme-${t.id}`));
    document.documentElement.classList.add(`theme-${next}`);
    try { localStorage.setItem('color-theme', next); } catch {}

    initialized.current = true;
  }, [colorTheme, setColorTheme]);

  // 当 colorTheme 变化时，同步类名和本地存储
  useEffect(() => {
    if (!colorTheme) return;
    document.documentElement.classList.remove(...themes.map(t => `theme-${t.id}`));
    document.documentElement.classList.add(`theme-${colorTheme}`);
    try { localStorage.setItem('color-theme', colorTheme); } catch {}
  }, [colorTheme]);

  const currentTheme = themes.find(t => t.id === colorTheme);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <span
            className="w-5 h-5 rounded-full"
            style={{ backgroundColor: currentTheme?.color }}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="p-2 grid grid-cols-7 gap-2 z-999">
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            onClick={() => setColorTheme(theme.id)}
            className="p-0 m-0"
          >
            <button
              className={`w-6 h-6 rounded-full transition-transform transform hover:scale-110 focus:outline-none ${colorTheme === theme.id ? 'ring-2 ring-offset-2 ring-white' : ''}`}
              style={{ backgroundColor: theme.color }}
              title={theme.name}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});