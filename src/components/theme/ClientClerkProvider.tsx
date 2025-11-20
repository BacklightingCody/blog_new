// components/ClientClerkProvider.tsx
'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { useThemeStore, themes } from '@/zustand/stores/themeStore';
import { useEffect, useLayoutEffect, useState } from 'react';

export default function ClientClerkProvider({ children }: { children: React.ReactNode }) {
  const { colorTheme } = useThemeStore();
  const [variables, setVariables] = useState<any>({});
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEyeMode, setIsEyeMode] = useState(false);

  // 监听主题变化
  useLayoutEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const updateTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
      setIsEyeMode(document.documentElement.classList.contains('eye-protection-mode'));
    };

    // 创建 MutationObserver 来监听 class 变化
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          updateTheme();
        }
      });
    });

    // 开始观察
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    // 初始化主题状态
    updateTheme();

    // 清理函数
    return () => observer.disconnect();
  }, []);

  // 更新 Clerk 主题和颜色
  useEffect(() => {
    const theme = themes.find((t) => t.id === colorTheme);
    if (!theme) return;

    // 根据当前模式选择颜色配置
    const themeColors = isEyeMode
      ? theme.eye
      : isDarkMode
        ? theme.dark
        : theme.light;

    setVariables({
      colorPrimary: themeColors.primaryColor,
      colorText: themeColors.textColor,
      colorBackground: isEyeMode ? themeColors.accent : isDarkMode ? themeColors.primaryColor : themeColors.accent,
      colorInputBackground: isDarkMode ? '#1e293b' : '#FFFFFF',
      colorInputText: themeColors.textColor,
      colorDanger: '#EF4444',
      colorSuccess: '#22C55E',
      borderRadius: '0.5rem',
    });
  }, [colorTheme, isDarkMode, isEyeMode]);

  return (
    <ClerkProvider
      appearance={{
        variables,
        baseTheme: undefined
      }}
    >
      {children}
    </ClerkProvider>
  );
}
