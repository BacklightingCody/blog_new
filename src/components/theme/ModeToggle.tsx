"use client"

import * as React from "react"
import { Moon, Sun, Eye } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from '@/lib/utils'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // 确保护眼模式和主题正确应用
  React.useEffect(() => {
    if (!mounted) return;
    
    const html = document.documentElement;
    
    // 清除所有模式类
    html.classList.remove('dark', 'light', 'eye-protection-mode');
    
    // 根据主题设置添加合适的类
    if (theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark')) {
      html.classList.add('dark');
    } else if (theme === 'eye-protection') {
      html.classList.add('eye-protection-mode');
    } else {
      html.classList.add('light');
    }
  }, [theme, resolvedTheme, mounted]);

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const current = theme === "system" ? resolvedTheme : theme

  // 处理主题切换的函数
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {/* 防止 SSR 阶段渲染 */}
          {mounted && (
            <>
              <Sun
                className={cn(
                  "h-[1.2rem] w-[1.2rem] transition-all text-theme-primary",
                  current === "light" && "rotate-0 scale-100",
                  current !== "light" && "-rotate-90 scale-0"
                )}
              />
              <Moon
                className={cn(
                  "absolute h-[1.2rem] w-[1.2rem] transition-all text-theme-primary",
                  current === "dark" && "rotate-0 scale-100",
                  current !== "dark" && "rotate-90 scale-0"
                )}
              />
              <Eye
                className={cn(
                  "absolute h-[1.2rem] w-[1.2rem] transition-all text-theme-primary",
                  current === "eye-protection" && "rotate-0 scale-100",
                  current !== "eye-protection" && "rotate-90 scale-0"
                )}
              />
            </>
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleThemeChange("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("eye-protection")}>
          Eye-Protection
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
