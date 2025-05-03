'use client';

import { useState, useEffect, useLayoutEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const themes = [
  { id: 'blue', name: '蓝色', color: '#3b82f6' },
  { id: 'red', name: '红色', color: '#ef4444' },
  { id: 'green', name: '绿色', color: '#10b981' },
  { id: 'purple', name: '紫色', color: '#8b5cf6' },
  { id: 'orange', name: '橙色', color: '#f97316' },
  { id: 'pink', name: '粉色', color: '#ec4899' },
  { id: 'teal', name: '青色', color: '#14b8a6' },
];

export function ThemeSelector() {
  const [colorTheme, setColorTheme] = useState('blue');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('color-theme') || 'blue';
    setColorTheme(saved);
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.remove(...themes.map(t => `theme-${t.id}`));
    document.documentElement.classList.add(`theme-${colorTheme}`);
    localStorage.setItem('color-theme', colorTheme);
  }, [colorTheme, mounted]);

  const handleColorThemeChange = (theme: string) => {
    setColorTheme(theme);
  };

  if (!mounted) return null;

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
      <DropdownMenuContent align="end" className="p-2 grid grid-cols-7 gap-2">
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            onClick={() => handleColorThemeChange(theme.id)}
            className="p-0 m-0"
          >
            <button
              className={`w-6 h-6 rounded-full transition-transform transform hover:scale-110 focus:outline-none ${colorTheme === theme.id ? 'ring-2 ring-offset-2 ring-white' : ''
                }`}
              style={{ backgroundColor: theme.color }}
              title={theme.name}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
