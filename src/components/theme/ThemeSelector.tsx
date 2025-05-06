'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useThemeStore, themes } from '@/zustand/themeStore';

export function ThemeSelector() {
  const { colorTheme, setColorTheme } = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.remove(...themes.map(t => `theme-${t.id}`));
    document.documentElement.classList.add(`theme-${colorTheme}`);
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
      <DropdownMenuContent align="end" className="p-2 grid grid-cols-7 gap-2">
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            onClick={() => setColorTheme(theme.id)}
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
